import { Router } from 'express';
import {
  listPublished,
  getPodcast,
  createPodcast,
  updatePodcast,
  deletePodcast,
  listAllAdmin,
  togglePublish,
} from '../controllers/podcasts.controller.js';
import { sessionMiddleware } from '../middleware/session.middleware.js';
import { requireRole } from '../middleware/rol.middleware.js';
import { validateCreatePodcast } from '../validators/podcast.validator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Podcasts
 *   description: Podcast endpoints
 */

/**
 * @swagger
 * /api/podcasts:
 *   get:
 *     tags: [Podcasts]
 *     summary: List published podcasts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of podcasts
 */
router.get('/', listPublished);

/**
 * @swagger
 * /api/podcasts/{id}:
 *   get:
 *     tags: [Podcasts]
 *     summary: Get a podcast
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Podcast
 */
router.get('/:id', getPodcast);

/**
 * @swagger
 * /api/podcasts:
 *   post:
 *     tags: [Podcasts]
 *     summary: Create podcast
 *     security:
 *       - BearerToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PodcastCreate'
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post('/', sessionMiddleware, validateCreatePodcast, createPodcast);

/**
 * @swagger
 * /api/podcasts/{id}:
 *   put:
 *     tags: [Podcasts]
 *     summary: Update own podcast
 *     security:
 *       - BearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Updated
 *       403:
 *         description: Forbidden
 */
router.put('/:id', sessionMiddleware, updatePodcast);

/**
 * @swagger
 * /api/podcasts/{id}:
 *   delete:
 *     tags: [Podcasts]
 *     summary: Delete podcast (admin)
 *     security:
 *       - BearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', sessionMiddleware, requireRole('admin'), deletePodcast);

/**
 * @swagger
 * /api/podcasts/admin/all:
 *   get:
 *     tags: [Podcasts]
 *     summary: List all podcasts (admin)
 *     security:
 *       - BearerToken: []
 *     responses:
 *       200:
 *         description: List of all podcasts
 */
router.get('/admin/all', sessionMiddleware, requireRole('admin'), listAllAdmin);

/**
 * @swagger
 * /api/podcasts/{id}/publish:
 *   patch:
 *     tags: [Podcasts]
 *     summary: Toggle publish (admin)
 *     security:
 *       - BearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Toggled
 */
router.patch(
  '/:id/publish',
  sessionMiddleware,
  requireRole('admin'),
  togglePublish
);

export default router;
