'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MaterialTag extends Model {
        static associate(models) {
            // 與 EducationalMaterial 的多對多關聯
            this.belongsToMany(models.EducationalMaterial, {
                through: 'material_tag_relations',
                foreignKey: 'tag_id',
                otherKey: 'material_id',
                as: 'materials'
            });
        }
    }

    MaterialTag.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '素材標籤ID'
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: '素材標籤名稱'
        }
    }, {
        sequelize,
        modelName: 'MaterialTag',
        tableName: 'material_tags',
        timestamps: false
    });

    return MaterialTag;
}; 