'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 創建用戶表
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '用戶ID'
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '用戶名稱'
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
                comment: '用戶信箱'
            },
            hospital: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: '用戶醫院'
            },
            doctor_name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '用戶醫師名稱'
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: '用戶手機號碼'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                comment: '用戶是否啟用'
            },
            privacy_agreed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: '用戶是否同意隱私政策'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '用戶創建時間'
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                comment: '用戶更新時間'
            }
        }, {
            comment: '用戶資料表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });

        // 創建藥品驗證表
        await queryInterface.createTable('medicine_verifications', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '藥品驗證ID'
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: '用戶ID'
            },
            medicine_code: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: '藥品驗證碼'
            },
            box_photo_url: {
                type: Sequelize.TEXT,
                comment: '藥品盒照片URL'
            },
            verified_at: {
                type: Sequelize.DATE,
                comment: '藥品驗證時間'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '藥品驗證創建時間'
            }
        }, {
            comment: '藥品驗證記錄表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });

        // 創建提醒設置表
        await queryInterface.createTable('reminders', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '提醒設置ID'
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                comment: '用戶ID'
            },
            type: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: '提醒類型'
            },
            reminder_date: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: '提醒日期'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                comment: '提醒是否啟用'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '提醒設置創建時間'
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                comment: '提醒設置更新時間'
            }
        }, {
            comment: '用戶提醒設置表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });

        // 創建衛教素材表
        await queryInterface.createTable('educational_materials', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '衛教素材ID'
            },
            primary_category: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '衛教素材主要類別'
            },
            secondary_category: {
                type: Sequelize.STRING(50),
                comment: '衛教素材次要類別'
            },
            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
                comment: '衛教素材標題'
            },
            content: {
                type: Sequelize.TEXT,
                comment: '衛教素材內容'
            },
            image_url: {
                type: Sequelize.TEXT,
                comment: '衛教素材圖片URL'
            },
            video_url: {
                type: Sequelize.TEXT,
                comment: '衛教素材影片URL'
            },
            view_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: '衛教素材瀏覽次數'
            },
            likes_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: '衛教素材喜歡次數'
            },
            dislikes_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: '衛教素材不喜歡次數'
            },
            published_at: {
                type: Sequelize.DATE,
                comment: '衛教素材發布時間'
            },
            expired_at: {
                type: Sequelize.DATE,
                comment: '衛教素材過期時間'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                comment: '衛教素材是否啟用'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '衛教素材創建時間'
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                comment: '衛教素材更新時間'
            }
        }, {
            comment: '衛教素材內容表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });

        // 創建素材標籤表
        await queryInterface.createTable('material_tags', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '素材標籤ID'
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                comment: '素材標籤名稱'
            }
        }, {
            comment: '衛教素材標籤表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });

        // 創建素材-標籤關聯表
        await queryInterface.createTable('material_tag_relations', {
            material_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'educational_materials',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                comment: '衛教素材ID'
            },
            tag_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'material_tags',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                comment: '素材標籤ID'
            }
        }, {
            comment: '衛教素材與標籤關聯表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });

        // 添加複合主鍵
        await queryInterface.addConstraint('material_tag_relations', {
            fields: ['material_id', 'tag_id'],
            type: 'primary key',
            name: 'material_tag_relations_pkey'
        });

        // 創建登入記錄表
        await queryInterface.createTable('login_records', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
                comment: '主鍵ID'
              },
              user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: 'users',
                  key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                comment: '用戶ID'
              },
              login_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                comment: '登入時間'
              },
              ip_address: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'IP地址'
              },
              user_agent: {
                type: Sequelize.TEXT,
                comment: '用戶瀏覽器資訊'
              },
              device_info: {
                type: Sequelize.JSON,
                comment: '設備資訊（瀏覽器、作業系統等）'
              },
              created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                comment: '創建時間'
              },
              updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                comment: '更新時間'
            }
        }, {
            comment: '用戶登入記錄表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });

        // 創建退出記錄表
        await queryInterface.createTable('withdrawal_records', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '退出記錄ID'
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                comment: '用戶ID'
            },
            withdrawal_type: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: '退出類型'
            },
            withdrawal_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '退出時間'
            }
        }, {
            comment: '用戶退出記錄表',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // 按照相反的順序刪除表
        await queryInterface.dropTable('withdrawal_records');
        await queryInterface.dropTable('login_records');
        await queryInterface.dropTable('material_tag_relations');
        await queryInterface.dropTable('material_tags');
        await queryInterface.dropTable('educational_materials');
        await queryInterface.dropTable('reminders');
        await queryInterface.dropTable('medicine_verifications');
        await queryInterface.dropTable('users');
    }
};
