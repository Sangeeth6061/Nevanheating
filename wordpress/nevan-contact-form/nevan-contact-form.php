<?php
/**
 * Plugin Name: Nevan Contact Form
 * Description: Stores contact form submissions and sends notification emails for the Nevan Plumbing headless frontend.
 * Version: 1.0.3
 * Author: Nevan Plumbing
 * Text Domain: nevan-contact-form
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('NEVAN_CONTACT_FORM_VERSION', '1.0.3');

class Nevan_Contact_Form_Database {
    public static function table_name() {
        global $wpdb;
        return $wpdb->prefix . 'nevan_contact_submissions';
    }

    public static function table_exists() {
        global $wpdb;
        $table = self::table_name();
        return $wpdb->get_var("SHOW TABLES LIKE '{$table}'") === $table;
    }

    public static function activate() {
        self::create_table();
        update_option('nevan_contact_form_db_version', NEVAN_CONTACT_FORM_VERSION);
    }

    public static function maybe_upgrade() {
        $installed = get_option('nevan_contact_form_db_version', '');

        if ($installed === NEVAN_CONTACT_FORM_VERSION && self::table_exists()) {
            return;
        }

        self::create_table();
        update_option('nevan_contact_form_db_version', NEVAN_CONTACT_FORM_VERSION);
    }

    public static function create_table() {
        global $wpdb;

        $table = self::table_name();
        $charset = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            full_name varchar(191) NOT NULL,
            email varchar(191) NOT NULL,
            phone varchar(100) NOT NULL DEFAULT '',
            service varchar(191) NOT NULL DEFAULT '',
            message longtext NOT NULL,
            ip_address varchar(45) NOT NULL DEFAULT '',
            user_agent text NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY created_at (created_at)
        ) {$charset};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    public static function insert(array $data) {
        global $wpdb;

        if (!self::table_exists()) {
            self::create_table();
        }

        $inserted = $wpdb->insert(
            self::table_name(),
            array(
                'full_name' => $data['full_name'],
                'email' => $data['email'],
                'phone' => isset($data['phone']) ? $data['phone'] : '',
                'service' => isset($data['service']) ? $data['service'] : '',
                'message' => $data['message'],
                'ip_address' => isset($data['ip_address']) ? $data['ip_address'] : '',
                'user_agent' => isset($data['user_agent']) ? $data['user_agent'] : '',
                'created_at' => current_time('mysql'),
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
        );

        if ($inserted === false) {
            return 0;
        }

        return (int) $wpdb->insert_id;
    }

    public static function get_submissions($limit = 100, $offset = 0) {
        global $wpdb;

        $table = self::table_name();
        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT %d OFFSET %d",
                $limit,
                $offset
            ),
            ARRAY_A
        );

        return is_array($results) ? $results : array();
    }

    public static function count_submissions() {
        global $wpdb;
        $table = self::table_name();
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
    }
}

class Nevan_Contact_Form_Mailer {
    public static function send_notifications(array $submission) {
        $admin_sent = self::send_admin_email($submission);
        $user_sent = self::send_user_confirmation($submission);

        return $admin_sent || $user_sent;
    }

    private static function notification_email() {
        $custom = get_option('nevan_contact_notification_email', '');
        if (is_string($custom) && is_email($custom)) {
            return $custom;
        }

        return get_option('admin_email');
    }

    private static function send_admin_email(array $submission) {
        $to = self::notification_email();
        $subject = sprintf(
            '[%s] New contact form submission from %s',
            wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES),
            $submission['full_name']
        );

        $body = implode("\n", array(
            'A new contact form submission was received.',
            '',
            'Name: ' . $submission['full_name'],
            'Email: ' . $submission['email'],
            'Phone: ' . ($submission['phone'] ? $submission['phone'] : '-'),
            'Service: ' . ($submission['service'] ? $submission['service'] : '-'),
            '',
            'Message:',
            $submission['message'],
            '',
            'Submitted: ' . current_time('mysql'),
        ));

        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $submission['full_name'] . ' <' . $submission['email'] . '>',
        );

        return wp_mail($to, $subject, $body, $headers);
    }

    private static function send_user_confirmation(array $submission) {
        $subject = sprintf(
            'We received your message - %s',
            wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES)
        );

        $body = implode("\n", array(
            'Hi ' . $submission['full_name'] . ',',
            '',
            'Thank you for contacting us. We have received your message and will get back to you within 2 hours during business hours.',
            '',
            'Here is a copy of your submission:',
            '',
            'Service: ' . ($submission['service'] ? $submission['service'] : '-'),
            'Phone: ' . ($submission['phone'] ? $submission['phone'] : '-'),
            '',
            $submission['message'],
            '',
            'Kind regards,',
            wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES),
        ));

        $headers = array('Content-Type: text/plain; charset=UTF-8');

        return wp_mail($submission['email'], $subject, $body, $headers);
    }
}

class Nevan_Contact_Form_REST_API {
    public static function register_routes() {
        register_rest_route(
            'nevan/v1',
            '/contact',
            array(
                'methods' => 'POST',
                'callback' => array(__CLASS__, 'handle_submission'),
                'permission_callback' => '__return_true',
            )
        );
    }

    public static function handle_submission(WP_REST_Request $request) {
        $full_name = sanitize_text_field((string) $request->get_param('full_name'));
        $email = sanitize_email((string) $request->get_param('email'));
        $phone = sanitize_text_field((string) $request->get_param('phone'));
        $service = sanitize_text_field((string) $request->get_param('service'));
        $message = sanitize_textarea_field((string) $request->get_param('message'));

        if ($full_name === '') {
            return new WP_Error('missing_name', 'Full name is required.', array('status' => 400));
        }

        if ($email === '' || !is_email($email)) {
            return new WP_Error('invalid_email', 'A valid email address is required.', array('status' => 400));
        }

        if ($message === '') {
            return new WP_Error('missing_message', 'Message is required.', array('status' => 400));
        }

        $submission = array(
            'full_name' => $full_name,
            'email' => $email,
            'phone' => $phone,
            'service' => $service,
            'message' => $message,
            'ip_address' => self::client_ip(),
            'user_agent' => isset($_SERVER['HTTP_USER_AGENT'])
                ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT']))
                : '',
        );

        $id = Nevan_Contact_Form_Database::insert($submission);

        if ($id <= 0) {
            return new WP_Error('save_failed', 'Unable to save your submission. Please try again.', array('status' => 500));
        }

        Nevan_Contact_Form_Mailer::send_notifications($submission);

        return new WP_REST_Response(
            array(
                'success' => true,
                'id' => $id,
                'message' => 'Thank you. Your message has been sent successfully.',
            ),
            201
        );
    }

    private static function client_ip() {
        $keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR');

        foreach ($keys as $key) {
            if (empty($_SERVER[$key])) {
                continue;
            }

            $value = sanitize_text_field(wp_unslash($_SERVER[$key]));
            if ($value !== '') {
                return $value;
            }
        }

        return '';
    }
}

class Nevan_Contact_Form_Admin {
    public static function init() {
        add_action('admin_menu', array(__CLASS__, 'register_menu'));
        add_action('admin_init', array(__CLASS__, 'register_settings'));
    }

    public static function register_menu() {
        add_menu_page(
            'Contact Submissions',
            'Contact Form',
            'manage_options',
            'nevan-contact-form',
            array(__CLASS__, 'render_page'),
            'dashicons-email-alt',
            26
        );
    }

    public static function register_settings() {
        register_setting('nevan_contact_form', 'nevan_contact_notification_email', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_email',
            'default' => '',
        ));
    }

    public static function render_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $submissions = Nevan_Contact_Form_Database::get_submissions(100);
        $notification_email = get_option('nevan_contact_notification_email', '');
        ?>
        <div class="wrap">
            <h1>Contact Form Submissions</h1>

            <form method="post" action="options.php" style="margin: 20px 0; max-width: 480px;">
                <?php settings_fields('nevan_contact_form'); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="nevan_contact_notification_email">Notification email</label></th>
                        <td>
                            <input
                                type="email"
                                id="nevan_contact_notification_email"
                                name="nevan_contact_notification_email"
                                value="<?php echo esc_attr($notification_email); ?>"
                                class="regular-text"
                                placeholder="<?php echo esc_attr(get_option('admin_email')); ?>"
                            />
                            <p class="description">Leave blank to use the WordPress admin email.</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Save Email Settings'); ?>
            </form>

            <p><strong><?php echo esc_html((string) Nevan_Contact_Form_Database::count_submissions()); ?></strong> total submissions</p>

            <table class="widefat fixed striped">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Service</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($submissions)) : ?>
                        <tr>
                            <td colspan="6">No submissions yet.</td>
                        </tr>
                    <?php else : ?>
                        <?php foreach ($submissions as $row) : ?>
                            <tr>
                                <td><?php echo esc_html($row['created_at']); ?></td>
                                <td><?php echo esc_html($row['full_name']); ?></td>
                                <td><a href="mailto:<?php echo esc_attr($row['email']); ?>"><?php echo esc_html($row['email']); ?></a></td>
                                <td><?php echo esc_html($row['phone']); ?></td>
                                <td><?php echo esc_html($row['service']); ?></td>
                                <td><?php echo esc_html(wp_trim_words($row['message'], 20, '...')); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}

register_activation_hook(__FILE__, array('Nevan_Contact_Form_Database', 'activate'));
add_action('plugins_loaded', array('Nevan_Contact_Form_Database', 'maybe_upgrade'));
add_action('rest_api_init', array('Nevan_Contact_Form_REST_API', 'register_routes'));

if (is_admin()) {
    Nevan_Contact_Form_Admin::init();
}
