'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EducationalMaterial extends Model {
        static associate(models) {
            this.belongsToMany(models.MaterialTag, {
                through: 'material_tag_relations',
                foreignKey: 'material_id',
                otherKey: 'tag_id',
                as: 'tags'
            });
        }
    }
    
    EducationalMaterial.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '衛教素材ID'
        },
        primary_category: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: '衛教素材主要類別'
        },
        secondary_category: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: '衛教素材次要類別'
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            comment: '衛教素材標題'
        },
        content: {
            type: DataTypes.TEXT,
            comment: '衛教素材內容'
        },
        image_url: {
            type: DataTypes.TEXT,
            comment: '衛教素材圖片URL'
        },
        video_url: {
            type: DataTypes.TEXT,
            comment: '衛教素材影片URL'
        },
        view_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '衛教素材瀏覽次數'
        },
        likes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '衛教素材喜歡次數'
        },
        dislikes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '衛教素材不喜歡次數'
        },
        published_at: {
            type: DataTypes.DATE,
            comment: '衛教素材發布時間'
        },
        expired_at: {
            type: DataTypes.DATE,
            comment: '衛教素材過期時間'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: '衛教素材是否啟用'
        }
    }, {
        sequelize,
        modelName: 'EducationalMaterial',
        tableName: 'educational_materials',
        underscored: true,
        timestamps: false,  // 明確設置不使用時間戳記
        createdAt: false,  // 明確禁用 created_at
        updatedAt: false,  // 明確禁用 updated_at
        freezeTableName: true // 防止 Sequelize 自動修改表名
    });
    
    return EducationalMaterial;
}; 