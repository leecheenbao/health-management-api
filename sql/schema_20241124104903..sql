-- 資料庫結構導出

-- users 表結構 (用戶資料表)
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用戶ID',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用戶名稱',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用戶信箱',
  `hospital` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用戶醫院',
  `doctor_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用戶醫師名稱',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用戶手機號碼',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '用戶是否啟用',
  `privacy_agreed` tinyint(1) DEFAULT '0' COMMENT '用戶是否同意隱私政策',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用戶創建時間',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '用戶更新時間',
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Google ID',
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用戶頭像URL',
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user' COMMENT '用戶角色 預設 0:user 1:admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用戶資料表';

-- medicine_verifications 表結構 (藥品驗證記錄表)
CREATE TABLE `medicine_verifications` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '藥品驗證ID',
  `user_id` int DEFAULT NULL COMMENT '用戶ID',
  `medicine_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '藥品驗證碼',
  `box_photo_url` text COLLATE utf8mb4_unicode_ci COMMENT '藥品盒照片URL',
  `verified_at` datetime DEFAULT NULL COMMENT '藥品驗證時間',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '藥品驗證創建時間',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `medicine_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='藥品驗證記錄表';

-- reminders 表結構 (用戶提醒設置表)
CREATE TABLE `reminders` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '提醒設置ID',
  `user_id` int DEFAULT NULL COMMENT '用戶ID',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '提醒類型',
  `reminder_date` datetime NOT NULL COMMENT '提醒日期',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '提醒是否啟用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提醒設置創建時間',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '提醒設置更新時間',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用戶提醒設置表';

-- educational_materials 表結構 (衛教素材內容表)
CREATE TABLE `educational_materials` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '衛教素材ID',
  `primary_category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '衛教素材主要類別',
  `secondary_category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '衛教素材次要類別',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '衛教素材標題',
  `content` text COLLATE utf8mb4_unicode_ci COMMENT '衛教素材內容',
  `image_url` text COLLATE utf8mb4_unicode_ci COMMENT '衛教素材圖片URL',
  `video_url` text COLLATE utf8mb4_unicode_ci COMMENT '衛教素材影片URL',
  `view_count` int DEFAULT '0' COMMENT '衛教素材瀏覽次數',
  `likes_count` int DEFAULT '0' COMMENT '衛教素材喜歡次數',
  `dislikes_count` int DEFAULT '0' COMMENT '衛教素材不喜歡次數',
  `published_at` datetime DEFAULT NULL COMMENT '衛教素材發布時間',
  `expired_at` datetime DEFAULT NULL COMMENT '衛教素材過期時間',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '衛教素材是否啟用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '衛教素材創建時間',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '衛教素材更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衛教素材內容表';

-- material_tags 表結構 (衛教素材標籤表)
CREATE TABLE `material_tags` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '素材標籤ID',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '素材標籤名稱',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衛教素材標籤表';

-- material_tag_relations 表結構 (衛教素材與標籤關聯表)
CREATE TABLE `material_tag_relations` (
  `material_id` int NOT NULL COMMENT '衛教素材ID',
  `tag_id` int NOT NULL COMMENT '素材標籤ID',
  PRIMARY KEY (`material_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `material_tag_relations_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `educational_materials` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `material_tag_relations_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `material_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衛教素材與標籤關聯表';

-- login_records 表結構 ()
CREATE TABLE `login_records` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主鍵ID',
  `user_id` int NOT NULL COMMENT '用戶ID',
  `login_at` datetime NOT NULL COMMENT '登入時間',
  `ip_address` varchar(255) NOT NULL COMMENT 'IP地址',
  `user_agent` text COMMENT '用戶瀏覽器資訊',
  `device_info` json DEFAULT NULL COMMENT '設備資訊（瀏覽器、作業系統等）',
  `created_at` datetime NOT NULL COMMENT '創建時間',
  `updated_at` datetime NOT NULL COMMENT '更新時間',
  PRIMARY KEY (`id`),
  KEY `login_records_user_id` (`user_id`),
  KEY `login_records_login_at` (`login_at`),
  CONSTRAINT `login_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- withdrawal_records 表結構 (用戶退出記錄表)
CREATE TABLE `withdrawal_records` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '退出記錄ID',
  `user_id` int DEFAULT NULL COMMENT '用戶ID',
  `withdrawal_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '退出類型',
  `withdrawal_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '退出時間',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `withdrawal_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用戶退出記錄表';

