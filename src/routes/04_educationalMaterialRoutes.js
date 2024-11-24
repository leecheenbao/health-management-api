const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const educationalMaterialService = require('../services/educationalMaterialService');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @api {get} /api/v1/materials 獲取所有衛教素材
 * @apiName GetMaterials
 * @apiGroup 03.衛教素材模組
 */
router.get('/', 
    authenticateToken,
    asyncHandler(educationalMaterialService.getMaterials)
);

/**
 * @api {get} /api/v1/materials/:id 獲取特定衛教素材
 * @apiName GetMaterial
 * @apiGroup 03.衛教素材模組
 */
router.get('/:id',
    authenticateToken,
    asyncHandler(educationalMaterialService.getMaterialById)
);

/**
 * @api {get} /api/v1/materials/category/:category 獲取特定類別的衛教素材
 * @apiName GetMaterialsByCategory
 * @apiGroup 03.衛教素材模組
 */
router.get('/category/:category',
    authenticateToken,
    asyncHandler(educationalMaterialService.getMaterialsByCategory)
);

/**
 * @api {get} /api/v1/materials/tag/:tagName 獲取特定標籤的衛教素材
 * @apiName GetMaterialsByTag
 * @apiGroup 03.衛教素材模組
 */
router.get('/tag/:tagName',
    authenticateToken,
    asyncHandler(educationalMaterialService.getMaterialsByTag)
);

/**
 * @api {post} /api/v1/materials 創建衛教素材
 * @apiName CreateMaterial
 * @apiGroup 03.衛教素材模組
 */
router.post('/',
    authenticateToken,
    asyncHandler(educationalMaterialService.createMaterial)
);

/**
 * @api {put} /api/v1/materials/:id 更新衛教素材
 * @apiName UpdateMaterial
 * @apiGroup 03.衛教素材模組
 */
router.put('/:id',
    authenticateToken,
    asyncHandler(educationalMaterialService.updateMaterial)
);

/**
 * @api {delete} /api/v1/materials/:id 刪除衛教素材
 * @apiName DeleteMaterial
 * @apiGroup 03.衛教素材模組
 */
router.delete('/:id',
    authenticateToken,
    asyncHandler(educationalMaterialService.deleteMaterial)
);

/**
 * @api {post} /api/v1/materials/:id/like 喜歡衛教素材
 * @apiName LikeMaterial
 * @apiGroup 03.衛教素材模組
 */
router.post('/:id/like',
    authenticateToken,
    asyncHandler(educationalMaterialService.likeMaterial)
); 

module.exports = router;