<?php
/**
 * Plugin Name: Nevan Google Reviews
 * Description: Syncs Google Business reviews (Places API) and exposes them to the headless frontend at /wp-json/nevan/v1/google-reviews.
 * Version: 1.0.0
 * Author: Nevan Plumbing
 * Text Domain: nevan-google-reviews
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Nevan_Google_Reviews {
    const OPTION_DATA = 'nevan_google_reviews_data';
    const OPTION_SETTINGS = 'nevan_google_reviews_settings';
    const CRON_HOOK = 'nevan_google_reviews_sync';
    const DEFAULT_QUERY = 'Nevan Plumbing and Heating Services Ltd';

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_routes'));
        add_action(self::CRON_HOOK, array(__CLASS__, 'sync'));
        add_action('admin_menu', array(__CLASS__, 'admin_menu'));
        add_action('admin_init', array(__CLASS__, 'register_settings'));
        add_action('admin_post_nevan_google_reviews_sync', array(__CLASS__, 'handle_sync_now'));
        add_action('admin_post_nevan_google_reviews_toggle', array(__CLASS__, 'handle_toggle'));
    }

    /* ------------------------------------------------------------------ */
    /* Lifecycle                                                           */
    /* ------------------------------------------------------------------ */

    public static function activate() {
        if (!get_option(self::OPTION_DATA)) {
            self::import_seed();
        }
        if (!wp_next_scheduled(self::CRON_HOOK)) {
            wp_schedule_event(time() + HOUR_IN_SECONDS, 'twicedaily', self::CRON_HOOK);
        }
    }

    public static function deactivate() {
        wp_clear_scheduled_hook(self::CRON_HOOK);
    }

    /** Initial reviews copied from the Google Business profile, so the site has content before an API key is set. */
    private static function import_seed() {
        $file = __DIR__ . '/seed-reviews.json';
        if (!file_exists($file)) {
            return;
        }
        $seed = json_decode(file_get_contents($file), true);
        if (!is_array($seed)) {
            return;
        }

        $data = self::empty_data();
        $data['place'] = array_merge($data['place'], $seed['place'] ?? array());
        foreach ($seed['reviews'] ?? array() as $review) {
            $review['source'] = 'seed';
            self::upsert_review($data, $review);
        }
        update_option(self::OPTION_DATA, $data, false);
    }

    /* ------------------------------------------------------------------ */
    /* Storage                                                             */
    /* ------------------------------------------------------------------ */

    private static function empty_data() {
        return array(
            'place' => array('name' => '', 'rating' => null, 'total' => null, 'url' => ''),
            'reviews' => array(),
            'last_sync' => null,
            'last_error' => null,
        );
    }

    public static function get_data() {
        $data = get_option(self::OPTION_DATA);
        return is_array($data) ? array_merge(self::empty_data(), $data) : self::empty_data();
    }

    public static function get_settings() {
        $settings = get_option(self::OPTION_SETTINGS);
        return array_merge(
            array('api_key' => '', 'place_id' => '', 'query' => self::DEFAULT_QUERY, 'min_rating' => 4),
            is_array($settings) ? $settings : array()
        );
    }

    /** Google allows one review per account per place, so the author name is a stable key across seed + API data. */
    private static function review_key($author) {
        return md5(strtolower(trim((string) $author)));
    }

    private static function upsert_review(array &$data, array $review) {
        if (empty($review['author']) || empty($review['text'])) {
            return;
        }
        $key = self::review_key($review['author']);
        $existing = $data['reviews'][$key] ?? array();

        $data['reviews'][$key] = array(
            'id' => $key,
            'author' => sanitize_text_field($review['author']),
            'author_photo' => esc_url_raw($review['author_photo'] ?? ($existing['author_photo'] ?? '')),
            'author_url' => esc_url_raw($review['author_url'] ?? ($existing['author_url'] ?? '')),
            'rating' => max(1, min(5, (int) ($review['rating'] ?? 5))),
            'text' => sanitize_textarea_field($review['text']),
            'time' => sanitize_text_field($review['time'] ?? ($existing['time'] ?? gmdate('c'))),
            'source' => $review['source'] ?? ($existing['source'] ?? 'google'),
            'hidden' => (bool) ($existing['hidden'] ?? false),
        );
    }

    /* ------------------------------------------------------------------ */
    /* Google Places API (New) sync                                        */
    /* ------------------------------------------------------------------ */

    private static function google_request($method, $url, $field_mask, $api_key, $body = null) {
        $args = array(
            'method' => $method,
            'timeout' => 20,
            'headers' => array(
                'X-Goog-Api-Key' => $api_key,
                'X-Goog-FieldMask' => $field_mask,
                'Content-Type' => 'application/json',
            ),
        );
        if ($body !== null) {
            $args['body'] = wp_json_encode($body);
        }

        $response = wp_remote_request($url, $args);
        if (is_wp_error($response)) {
            return $response;
        }

        $json = json_decode(wp_remote_retrieve_body($response), true);
        $code = wp_remote_retrieve_response_code($response);
        if ($code >= 400) {
            $message = $json['error']['message'] ?? ('HTTP ' . $code);
            return new WP_Error('nevan_google_reviews_api', $message);
        }
        return is_array($json) ? $json : array();
    }

    private static function resolve_place_id(array $settings) {
        if (!empty($settings['place_id'])) {
            return $settings['place_id'];
        }

        $result = self::google_request(
            'POST',
            'https://places.googleapis.com/v1/places:searchText',
            'places.id,places.displayName',
            $settings['api_key'],
            array('textQuery' => $settings['query'] ?: self::DEFAULT_QUERY)
        );
        if (is_wp_error($result)) {
            return $result;
        }

        $place_id = $result['places'][0]['id'] ?? '';
        if (!$place_id) {
            return new WP_Error('nevan_google_reviews_place', 'No Google place found for the search text.');
        }

        $settings['place_id'] = $place_id;
        update_option(self::OPTION_SETTINGS, $settings);
        return $place_id;
    }

    public static function sync() {
        $settings = self::get_settings();
        $data = self::get_data();

        if (empty($settings['api_key'])) {
            $data['last_error'] = 'No Google API key configured.';
            update_option(self::OPTION_DATA, $data, false);
            return new WP_Error('nevan_google_reviews_key', $data['last_error']);
        }

        $place_id = self::resolve_place_id($settings);
        if (is_wp_error($place_id)) {
            $data['last_error'] = $place_id->get_error_message();
            update_option(self::OPTION_DATA, $data, false);
            return $place_id;
        }

        $place = self::google_request(
            'GET',
            'https://places.googleapis.com/v1/places/' . rawurlencode($place_id) . '?languageCode=en',
            'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
            $settings['api_key']
        );
        if (is_wp_error($place)) {
            $data['last_error'] = $place->get_error_message();
            update_option(self::OPTION_DATA, $data, false);
            return $place;
        }

        $data['place'] = array(
            'name' => $place['displayName']['text'] ?? $data['place']['name'],
            'rating' => isset($place['rating']) ? (float) $place['rating'] : $data['place']['rating'],
            'total' => isset($place['userRatingCount']) ? (int) $place['userRatingCount'] : $data['place']['total'],
            'url' => $place['googleMapsUri'] ?? $data['place']['url'],
        );

        // The API returns up to 5 reviews per call; merging keeps every review seen so far.
        foreach ($place['reviews'] ?? array() as $review) {
            self::upsert_review($data, array(
                'author' => $review['authorAttribution']['displayName'] ?? '',
                'author_photo' => $review['authorAttribution']['photoUri'] ?? '',
                'author_url' => $review['authorAttribution']['uri'] ?? '',
                'rating' => $review['rating'] ?? 5,
                'text' => $review['originalText']['text'] ?? ($review['text']['text'] ?? ''),
                'time' => $review['publishTime'] ?? gmdate('c'),
                'source' => 'google',
            ));
        }

        $data['last_sync'] = gmdate('c');
        $data['last_error'] = null;
        update_option(self::OPTION_DATA, $data, false);
        return true;
    }

    /* ------------------------------------------------------------------ */
    /* REST API                                                            */
    /* ------------------------------------------------------------------ */

    public static function register_routes() {
        register_rest_route('nevan/v1', '/google-reviews', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'rest_get_reviews'),
            'permission_callback' => '__return_true',
        ));
    }

    public static function rest_get_reviews() {
        $data = self::get_data();
        $settings = self::get_settings();
        $min_rating = (int) $settings['min_rating'];

        $reviews = array_values(array_filter($data['reviews'], function ($review) use ($min_rating) {
            return empty($review['hidden']) && (int) $review['rating'] >= $min_rating;
        }));
        usort($reviews, function ($a, $b) {
            return strcmp($b['time'], $a['time']);
        });

        $now = time();
        $reviews = array_map(function ($review) use ($now) {
            $timestamp = strtotime($review['time']);
            return array(
                'id' => $review['id'],
                'author' => $review['author'],
                'author_photo' => $review['author_photo'],
                'author_url' => $review['author_url'],
                'rating' => (int) $review['rating'],
                'text' => $review['text'],
                'time' => $review['time'],
                'relative_time' => $timestamp ? human_time_diff($timestamp, $now) . ' ago' : '',
            );
        }, $reviews);

        return rest_ensure_response(array(
            'place' => $data['place'],
            'reviews' => $reviews,
            'last_sync' => $data['last_sync'],
        ));
    }

    /* ------------------------------------------------------------------ */
    /* Admin                                                               */
    /* ------------------------------------------------------------------ */

    public static function admin_menu() {
        add_options_page('Google Reviews', 'Google Reviews', 'manage_options', 'nevan-google-reviews', array(__CLASS__, 'render_admin_page'));
    }

    public static function register_settings() {
        register_setting('nevan_google_reviews', self::OPTION_SETTINGS, array(
            'type' => 'array',
            'sanitize_callback' => function ($input) {
                return array(
                    'api_key' => sanitize_text_field($input['api_key'] ?? ''),
                    'place_id' => sanitize_text_field($input['place_id'] ?? ''),
                    'query' => sanitize_text_field($input['query'] ?? self::DEFAULT_QUERY),
                    'min_rating' => max(1, min(5, (int) ($input['min_rating'] ?? 4))),
                );
            },
        ));
    }

    public static function handle_sync_now() {
        if (!current_user_can('manage_options')) {
            wp_die('Not allowed');
        }
        check_admin_referer('nevan_google_reviews_sync');
        $result = self::sync();
        $status = is_wp_error($result) ? 'error' : 'synced';
        wp_safe_redirect(admin_url('options-general.php?page=nevan-google-reviews&status=' . $status));
        exit;
    }

    public static function handle_toggle() {
        if (!current_user_can('manage_options')) {
            wp_die('Not allowed');
        }
        check_admin_referer('nevan_google_reviews_toggle');
        $key = sanitize_key($_POST['review'] ?? '');
        $data = self::get_data();
        if (isset($data['reviews'][$key])) {
            $data['reviews'][$key]['hidden'] = empty($data['reviews'][$key]['hidden']);
            update_option(self::OPTION_DATA, $data, false);
        }
        wp_safe_redirect(admin_url('options-general.php?page=nevan-google-reviews'));
        exit;
    }

    public static function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        $settings = self::get_settings();
        $data = self::get_data();
        $reviews = $data['reviews'];
        uasort($reviews, function ($a, $b) {
            return strcmp($b['time'], $a['time']);
        });
        $status = sanitize_key($_GET['status'] ?? '');
        ?>
        <div class="wrap">
            <h1>Google Reviews</h1>

            <?php if ($status === 'synced') : ?>
                <div class="notice notice-success"><p>Reviews synced from Google.</p></div>
            <?php elseif ($status === 'error') : ?>
                <div class="notice notice-error"><p>Sync failed: <?php echo esc_html($data['last_error']); ?></p></div>
            <?php endif; ?>

            <p>
                Rating: <strong><?php echo esc_html($data['place']['rating'] ?? '-'); ?></strong>
                from <strong><?php echo esc_html($data['place']['total'] ?? '-'); ?></strong> Google reviews.
                Last sync: <?php echo $data['last_sync'] ? esc_html(get_date_from_gmt($data['last_sync'], 'j M Y H:i')) : 'never'; ?>.
                <?php if (!empty($data['last_error'])) : ?>
                    <br><span style="color:#b32d2e;">Last error: <?php echo esc_html($data['last_error']); ?></span>
                <?php endif; ?>
            </p>
            <p>Reviews sync automatically twice a day. Google's API returns the 5 most relevant reviews per request; every review it returns is kept here, so the list grows over time.</p>

            <form method="post" action="options.php" style="max-width:640px;">
                <?php settings_fields('nevan_google_reviews'); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="ngr_api_key">Google API key</label></th>
                        <td>
                            <input type="password" id="ngr_api_key" class="regular-text" name="<?php echo esc_attr(self::OPTION_SETTINGS); ?>[api_key]" value="<?php echo esc_attr($settings['api_key']); ?>" autocomplete="off">
                            <p class="description">Google Cloud key with the <em>Places API (New)</em> enabled.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="ngr_place_id">Place ID</label></th>
                        <td>
                            <input type="text" id="ngr_place_id" class="regular-text" name="<?php echo esc_attr(self::OPTION_SETTINGS); ?>[place_id]" value="<?php echo esc_attr($settings['place_id']); ?>">
                            <p class="description">Leave blank to look it up automatically from the search text below.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="ngr_query">Business search text</label></th>
                        <td><input type="text" id="ngr_query" class="regular-text" name="<?php echo esc_attr(self::OPTION_SETTINGS); ?>[query]" value="<?php echo esc_attr($settings['query']); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="ngr_min">Minimum stars to show</label></th>
                        <td><input type="number" min="1" max="5" id="ngr_min" name="<?php echo esc_attr(self::OPTION_SETTINGS); ?>[min_rating]" value="<?php echo esc_attr($settings['min_rating']); ?>"></td>
                    </tr>
                </table>
                <?php submit_button('Save Settings'); ?>
            </form>

            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="nevan_google_reviews_sync">
                <?php wp_nonce_field('nevan_google_reviews_sync'); ?>
                <?php submit_button('Sync Now', 'secondary', 'submit', false); ?>
            </form>

            <h2 style="margin-top:32px;">Stored reviews (<?php echo count($reviews); ?>)</h2>
            <table class="widefat striped">
                <thead><tr><th>Author</th><th>Stars</th><th>Date</th><th>Review</th><th>Status</th></tr></thead>
                <tbody>
                <?php foreach ($reviews as $key => $review) : ?>
                    <tr>
                        <td><?php echo esc_html($review['author']); ?></td>
                        <td><?php echo esc_html(str_repeat('★', (int) $review['rating'])); ?></td>
                        <td><?php echo esc_html(mysql2date('j M Y', $review['time'])); ?></td>
                        <td><?php echo esc_html(wp_trim_words($review['text'], 30)); ?></td>
                        <td>
                            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                                <input type="hidden" name="action" value="nevan_google_reviews_toggle">
                                <input type="hidden" name="review" value="<?php echo esc_attr($key); ?>">
                                <?php wp_nonce_field('nevan_google_reviews_toggle'); ?>
                                <button class="button button-small"><?php echo empty($review['hidden']) ? 'Hide' : 'Show'; ?></button>
                                <?php echo empty($review['hidden']) ? '' : ' <em>hidden</em>'; ?>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}

register_activation_hook(__FILE__, array('Nevan_Google_Reviews', 'activate'));
register_deactivation_hook(__FILE__, array('Nevan_Google_Reviews', 'deactivate'));
Nevan_Google_Reviews::init();
