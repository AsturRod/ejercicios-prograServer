import Podcast from "../models/podcast.model.js";

export const listPublished = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const podcasts = await Podcast.find({ published: true })
      .populate("author", "name email")
      .skip(skip)
      .limit(limit);
    return res.status(200).json(podcasts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error de servidor" });
  }
};

export const getPodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id).populate(
      'author',
      'name email'
    );
    if (!podcast || (!podcast.published && req.user?.role !== 'admin')) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    return res.status(200).json(podcast);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error getting podcast' });
  }
};

export const createPodcast = async (req, res) => {
  try {
    const data = req.body;
    const podcast = await Podcast.create({
      ...data,
      author: req.user._id,
    });
    return res.status(201).json(podcast);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error de servidor" });
  }
};

export const updatePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: "Podcast no encontrado" });
    }
    if (podcast.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    Object.assign(podcast, req.body);
    await podcast.save();
    return res.status(200).json(podcast);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error de servidor" });
  }
};

export const deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: "Podcast no encontrado" });
    }
    return res.status(200).json({ message: "Podcast eliminado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error de servidor" });
  }
};

export const listAllAdmin = async (req, res) => {
  try {
    const podcasts = await Podcast.find().populate("author", "name email");
    return res.status(200).json(podcasts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error de servidor" });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: "Podcast no encontrado" });
    }
    podcast.published = !podcast.published;
    await podcast.save();
    return res.status(200).json(podcast);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error de servidor" });
  }
};
