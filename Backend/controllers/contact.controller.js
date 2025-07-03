import db from '../config/db.js';

// Submit contact form
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: 400,
        message: 'All fields are required (name, email, subject, message)',
        success: false
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: 'Please provide a valid email address',
        success: false
      });
    }

    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                     (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const userAgent = req.get('User-Agent') || '';

    // Insert into database
    const insertQuery = `
      INSERT INTO web_mods_user_responce 
      (name, email, subject, message, ip_address, user_agent) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [name, email, subject, message, ipAddress, userAgent], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          status: 500,
          message: 'Failed to save your message. Please try again.',
          success: false
        });
      }

      res.status(201).json({
        status: 201,
        message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
        success: true,
        data: {
          id: result.insertId,
          submittedAt: new Date().toISOString()
        }
      });
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error. Please try again later.',
      success: false
    });
  }
}; 