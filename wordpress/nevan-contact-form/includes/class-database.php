<?php

if (!defined('ABSPATH')) {
    exit;
}

class Nevan_Contact_Form_Database {
    public static function table_name(): string {
        global $wpdb;
        return $wpdb->prefix . 'nevan_contact_submissions';
    }

    public static function activate(): void {
        self::create_table();
    }

    public static function create_table(): void {
        global $wpdb;

        $table = self::table_name();
        $charset = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            full_name varchar(191) NOT NULL,
            email varchar(191) NOT NULL,
            phone varchar(100) DEFAULT '',
            service varchar(191) DEFAULT '',
            message longtext NOT NULL,
            ip_address varchar(45) DEFAULT '',
            user_agent text,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY created_at (created_at)
        ) {$charset};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    public static function insert(array $data): int {
        global $wpdb;

        $wpdb->insert(
            self::table_name(),
            [
                'full_name' => $data['full_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? '',
                'service' => $data['service'] ?? '',
                'message' => $data['message'],
                'ip_address' => $data['ip_address'] ?? '',
                'user_agent' => $data['user_agent'] ?? '',
                'created_at' => current_time('mysql'),
            ],
            ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
        );

        return (int) $wpdb->insert_id;
    }

    public static function get_submissions(int $limit = 100, int $offset = 0): array {
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

        return is_array($results) ? $results : [];
    }

    public static function count_submissions(): int {
        global $wpdb;
        $table = self::table_name();
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
    }
}
