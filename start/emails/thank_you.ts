class CreateThankYouMessage {
  fullname: string
  year: number

  constructor(fullname: string, year: number) {
    this.fullname = fullname
    this.year = year
  }

  getHTML() {
    const thankYou = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thank You</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">Thank You, ${this.fullname}!</h1>
          </div>
          <p>Dear ${this.fullname},</p>
          <p>
            We sincerely appreciate your support and trust in us. Your contribution means a lot, and we are thrilled to have you as part of our community.
          </p>
          <p>
            If you have any questions or need assistance, feel free to reach out to us at any time.
          </p>
          <p>Best regards,</p>
          <p>The V and Bruno Team</p>
          <div style="text-align: center; margin-top: 20px; font-size: 0.9em; color: #777;">
            <p>
              If you ever need help, just reply to this email or contact us at
              <a href="mailto:vladimir@vandbruno.net" style="color: #555;">vladimir@vandbruno.net</a>.
            </p>
            <p>&copy; ${this.year} V and Bruno. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

    return thankYou
  }
}

export default CreateThankYouMessage
