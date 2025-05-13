import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    bio: vine.string().maxLength(1000).optional(),
    //TODO: custom LinkedIn verifier
    linkedinUrl: vine.string().url().maxLength(120).nullable(),
    //TODO: custom Insta verifier
    instagramUrl: vine.string().url().maxLength(120).nullable(),
    //hopefully prevents malware scripts
    additionalUrl: vine.string().url().maxLength(120).nullable(),
    //Overlay on frontend with this name
    additionalUrlName: vine.string().alphaNumeric().minLength(5).maxLength(150).nullable(),

    //Optional: user added contact number >> no email because, it's on the User Model
    mobileNumber: vine.string().mobile().minLength(5).maxLength(20).nullable(),
    profileTitle: vine.string().alphaNumeric().minLength(3).maxLength(150),
  })
)
