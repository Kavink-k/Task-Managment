const nodemailer = require('nodemailer');

// Configure Nodemailer Transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || user === 'demo@taskflow.com') {
    // Return a dummy transporter for development/demo when real credentials aren't set
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // or custom SMTP settings from env
    auth: {
      user,
      pass
    }
  });
};

/**
  Send email notification to employee when a new task is assigned
 */
const sendTaskAssignedEmail = async ({
  employeeEmail,
  employeeName,
  taskTitle,
  taskDescription,
  priority,
  status,
  assignedDate
}) => {
  try {
    const transporter = createTransporter();

    const formattedDate = new Date(assignedDate || Date.now()).toLocaleString();
    const mailOptions = {
      from: `"TaskFlow System" <${process.env.EMAIL_USER || 'no-reply@taskflow.com'}>`,
      to: employeeEmail,
      subject: 'New Task Assigned to You',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #2563eb; margin-top: 0;">TaskFlow - New Task Assignment</h2>
            <p>Hello <strong>${employeeName}</strong>,</p>
            <p>You have been assigned a new task by the administrator. Here are the details:</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 5px 0;"><strong>Task Title:</strong> ${taskTitle}</p>
              <p style="margin: 5px 0;"><strong>Description:</strong> ${taskDescription}</p>
              <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="display:inline-block; padding: 2px 8px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 12px; font-weight: bold;">${priority}</span></p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${status}</p>
              <p style="margin: 5px 0;"><strong>Assigned Date:</strong> ${formattedDate}</p>
            </div>

            <p>Please log in to your Employee Dashboard to view and manage your assigned tasks.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;">This is an automated notification from TaskFlow Task Management System.</p>
          </div>
        </div>
      `
    };

    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Success] Task assignment email sent to ${employeeEmail}: ${info.messageId}`);
    } else {
      console.log(`[Email Log Demo] Task assignment email simulation for ${employeeEmail}: Task "${taskTitle}"`);
    }
    return { success: true };
  } catch (error) {
    console.error(`[Email Error] Failed to send task assignment email to ${employeeEmail}:`, error.message);
    // Graceful error return as required by spec #9
    return { success: false, error: error.message };
  }
};

/**
  Send email notification to admin when an employee updates task status
 */
const sendTaskStatusUpdatedEmail = async ({
  adminEmail,
  employeeName,
  taskTitle,
  previousStatus,
  newStatus,
  updatedDate
}) => {
  try {
    const transporter = createTransporter();
    const recipient = adminEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const formattedDate = new Date(updatedDate || Date.now()).toLocaleString();
    const mailOptions = {
      from: `"TaskFlow System" <${process.env.EMAIL_USER || 'no-reply@taskflow.com'}>`,
      to: recipient,
      subject: 'Task Status Updated',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #059669; margin-top: 0;">TaskFlow - Task Status Update</h2>
            <p>Hello Admin,</p>
            <p>An employee has updated the status of an assigned task. Details below:</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 5px 0;"><strong>Employee:</strong> ${employeeName}</p>
              <p style="margin: 5px 0;"><strong>Task Title:</strong> ${taskTitle}</p>
              <p style="margin: 5px 0;"><strong>Previous Status:</strong> ${previousStatus}</p>
              <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="display:inline-block; padding: 2px 8px; background: #dcfce7; color: #15803d; border-radius: 4px; font-size: 12px; font-weight: bold;">${newStatus}</span></p>
              <p style="margin: 5px 0;"><strong>Updated Date:</strong> ${formattedDate}</p>
            </div>

            <p>Log in to the Admin Dashboard to see updated task progress and statistics.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;">This is an automated notification from TaskFlow Task Management System.</p>
          </div>
        </div>
      `
    };

    if (transporter && recipient) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Success] Task status update email sent to ${recipient}: ${info.messageId}`);
    } else {
      console.log(`[Email Log Demo] Status update email simulation for Admin: Employee ${employeeName} changed "${taskTitle}" to ${newStatus}`);
    }
    return { success: true };
  } catch (error) {
    console.error(`[Email Error] Failed to send status update email to admin:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTaskAssignedEmail,
  sendTaskStatusUpdatedEmail
};
