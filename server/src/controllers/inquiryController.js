import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';

const validStatuses = ['new', 'contacted', 'closed'];

const canManageInquiry = (user, inquiry) => {
  return user.role === 'admin' || inquiry.owner.toString() === user.id;
};

export const createInquiry = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { name, email, phone, message } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      });
    }

    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({
        message: 'You cannot send an inquiry to your own property',
      });
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      sender: req.user.id,
      owner: property.owner,
      name,
      email,
      phone,
      message,
    });

    return res.status(201).json({
      message: 'Inquiry sent successfully',
      inquiry,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to send inquiry',
      error: error.message,
    });
  }
};

export const getMyPropertyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .populate('property', 'title price location')
      .populate('sender', 'fullName email');

    return res.status(200).json({
      message: 'Inquiries fetched successfully',
      inquiries,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch inquiries',
      error: error.message,
    });
  }
};

export const getAllInquiries = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access required',
      });
    }

    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .populate('property', 'title price location')
      .populate('sender', 'fullName email')
      .populate('owner', 'fullName email');

    return res.status(200).json({
      message: 'All inquiries fetched successfully',
      inquiries,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch inquiries',
      error: error.message,
    });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Status must be one of: new, contacted, closed',
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        message: 'Inquiry not found',
      });
    }

    if (!canManageInquiry(req.user, inquiry)) {
      return res.status(403).json({
        message: 'You are not allowed to update this inquiry',
      });
    }

    inquiry.status = status;
    await inquiry.save();

    return res.status(200).json({
      message: 'Inquiry status updated successfully',
      inquiry,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update inquiry status',
      error: error.message,
    });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        message: 'Inquiry not found',
      });
    }

    if (!canManageInquiry(req.user, inquiry)) {
      return res.status(403).json({
        message: 'You are not allowed to delete this inquiry',
      });
    }

    await Inquiry.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete inquiry',
      error: error.message,
    });
  }
};
