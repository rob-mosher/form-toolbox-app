// TODO: Use hex suffix from Terraform in `form-toolbox`, ie `form-toolbox-<hex>`
// TODO: Use unique directory name for each upload instead of just `uploads`
//   (i.e. uploads-<hex> or uploads-<timestamp>), or
//   (i.e. uploads/<hex> or uploads/<timestamp>)
export const TEMP_UPLOAD_DIR = process.env.TEMP_UPLOAD_DIR || '/tmp/form-toolbox/uploads'
