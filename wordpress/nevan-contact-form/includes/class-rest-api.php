<?php

if (!defined('ABSPATH')) {
    exit;
}

class Nevan_Contact_Form_REST_API {
    public static function register_routes(): void {
        register_rest_route(
            'nevan/v1',
            '/contact',
            [
                'methods' => 'POST',
                'callback' => [self::class, 'handle_submission'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public static function handle_submission(WP_REST_Request $request) {
        $full_name = sanitize_text_field((string) $request->get_param('full_name'));
        $email = sanitize_email((string) $request->get_param('email'));
        $phone = sanitize_text_field((string) $request->get_param('phone'));
        $service = sanitize_text_field((string) $request->get_param('service'));
        $message = sanitize_textarea_field((string) $request->get_param('message'));

        if ($full_name === '') {
            return new WP_Error('missing_name', 'Full name is required.', ['status' => 400]);
        }

        if ($email === '' || !is_email($email)) {
            return new WP_Error('invalid_email', 'A valid email address is required.', ['status' => 400]);
        }

        if ($message === '') {
            return new WP_Error('missing_message', 'Message is required.', ['status' => 400]);
        }

        $submission = [
            'full_name' => $full_name,
            'email' => $email,
            'phone' => $phone,
            'service' => $service,
            'message' => $message,
            'ip_address' => self::client_ip(),
            'user_agent' => isset($_SERVER['HTTP_USER_AGENT'])
                ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT']))
                : '',
        ];

        $id = Nevan_Contact_Form_Database::insert($submission);

        if ($id <= 0) {
            return new WP_Error('save_failed', 'Unable to save your submission. Please try again.', ['status' => 500]);
        }

        Nevan_Contact_Form_Mailer::send_notifications($submission);

        return new WP_REST_Response(
            [
                'success' => true,
                'id' => $id,
                'message' => 'Thank you. Your message has been sent successfully.',
            ],
            201
        );
    }

    private static function client_ip(): string {
        $keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];

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
