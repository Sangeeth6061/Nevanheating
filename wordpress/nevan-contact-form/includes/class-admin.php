<?php

if (!defined('ABSPATH')) {
    exit;
}

class Nevan_Contact_Form_Admin {
    public static function init(): void {
        add_action('admin_menu', [self::class, 'register_menu']);
        add_action('admin_init', [self::class, 'register_settings']);
    }

    public static function register_menu(): void {
        add_menu_page(
            'Contact Submissions',
            'Contact Form',
            'manage_options',
            'nevan-contact-form',
            [self::class, 'render_page'],
            'dashicons-email-alt',
            26
        );
    }

    public static function register_settings(): void {
        register_setting('nevan_contact_form', 'nevan_contact_notification_email', [
            'type' => 'string',
            'sanitize_callback' => 'sanitize_email',
            'default' => '',
        ]);
    }

    public static function render_page(): void {
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
                                <td><?php echo esc_html(wp_trim_words($row['message'], 20, '…')); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}
