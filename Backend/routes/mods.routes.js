import express from 'express';
import apiKeyAuth from '../middleware/apiKeyAuth.js';
import getPaginatedMods from '../controllers/mods/getPaginatedMods.js';
import getHomeScreenData from '../controllers/mods/getHomeScreenData.js';
import downloadMod from '../controllers/mods/downloadMod.js';
import { increaseDownloadCount } from '../controllers/mods/increaseDownlaodCount.js';
import { increaseLikes } from '../controllers/mods/increaseLikes.js';
import { disLike } from '../controllers/mods/disLike.js';
import { getModDetail } from '../controllers/mods/getModDetail.js';
import { getModBySlug } from '../controllers/mods/getModBySlug.js';
import { filterModsByCategoryAndSubcategory } from '../controllers/mods/filterModsByCategoryAndSubcategory.js';
import { searchMod } from '../controllers/mods/searchMod.js';
import { storeSearchKeyword } from '../controllers/mods/storeSearchKeyword.js';
import { getPopularSearchKeywords } from '../controllers/mods/getPopularSearchKeywords.js';

const router = express.Router();
router.use(apiKeyAuth);

router.post('/', getPaginatedMods); 
router.post('/download', downloadMod); 
router.post('/home', getHomeScreenData); 
router.post('/increaseDownloadCount', increaseDownloadCount); 
router.post('/increaseLikes', increaseLikes); 
router.post('/dislike', disLike);
router.post('/getModDetail', getModDetail);
router.post('/getModBySlug', getModBySlug);
router.post('/filterModsByCategoryAndSubcategory', filterModsByCategoryAndSubcategory);
router.post('/search', searchMod);
router.post('/storeSearchKeyword', storeSearchKeyword);
router.get('/popularSearchKeywords', getPopularSearchKeywords);

export default router;
