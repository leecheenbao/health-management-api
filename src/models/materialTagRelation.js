'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MaterialTagRelation extends Model {
        static associate(models) {
            // 這個模型不需要定義額外的關聯，因為它是中間表
        }
    }

    MaterialTagRelation.init({
        material_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'educational_materials',
                key: 'id'
            },
            comment: '衛教素材ID'
        },
        tag_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'material_tags',
                key: 'id'
            },
            comment: '素材標籤ID'
        }
    }, {
        sequelize,
        modelName: 'MaterialTagRelation',
        tableName: 'material_tag_relations',
        timestamps: false
    });

    return MaterialTagRelation;
}; 