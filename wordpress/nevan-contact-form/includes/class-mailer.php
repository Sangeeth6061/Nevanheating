<?php

if (!defined('ABSPATH')) {
    exit;
}

class Nevan_Contact_Form_Mailer {
    public static function send_notifications(array $submission): bool {
        $admin_sent = self::send_admin_email($submission);
        $user_sent = self::send_user_confirmation($submission);

        return $admin_sent || $user_sent;
    }

    private static function notification_email(): string {
        $custom = get_option('nevan_contact_notification_email', '');
        if (is_string($custom) && is_email($custom)) {
            return $custom;
        }

        return get_option('admin_email');
    }

    private static function send_admin_email(array $submission): bool {
        $to = self::notification_email();
        $subject = sprintf(
            '[%s] New contact form submission from %s',
            wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES),
            $submission['full_name']
        );

        $body = implode("\n", [
            'A new contact form submission was received.',
            '',
            'Name: ' . $submission['full_name'],
            'Email: ' . $submission['email'],
            'Phone: ' . ($submission['phone'] ?: '—'),
            'Service: ' . ($submission['service'] ?: '—'),
            '',
            'Message:',
            $submission['message'],
            '',
            'Submitted: ' . current_time('mysql'),
        ]);

        $headers = [
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $submission['full_name'] . ' <' . $submission['email'] . '>',
        ];

        return wp_mail($to, $subject, $body, $headers);
    }

    private static function send_user_confirmation(array $submission): bool {
        $subject = sprintf(
            'We received your message — %s',
            wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES)
        );

        $body = implode("\n", [
            'Hi ' . $submission['full_name'] . ',',
            '',
            'Thank you for contacting us. We have received your message and will get back to you within 2 hours during business hours.',
            '',
            'Here is a copy of your submission:',
            '',
            'Service: ' . ($submission['service'] ?: '—'),
            'Phone: ' . ($submission['phone'] ?: '—'),
            '',
            $submission['message'],
            '',
            'Kind regards,',
            wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES),
        ]);

        $headers = ['Content-Type: text/plain; charset=UTF-8'];

        return wp_mail($submission['email'], $subject, $body, $headers);
    }
}
