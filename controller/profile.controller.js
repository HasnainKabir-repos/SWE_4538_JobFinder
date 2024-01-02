const Profile = require('../model/Profile');
 
const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const photo = req.file.filename;

    const {email} = req.user;
    const profile = await Profile.findOne({email:email});

    if (profile && photo) {
      profile.photo = photo;
      await profile.save();
    }else if(photo){

        const newProfile = {
            email: email,
            photo :photo
        }

        await Profile.create(newProfile);
    }

    res.json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const uploadVideo = async(req, res) =>{
  try{
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const video = req.file.filename;

    const {email} = req.user;

    const profile = await Profile.findOne({email:email});

    if(!profile){
      res.status(400).json({message:"Profile not found"});
    }else{
      profile.video = video;

      await profile.save();

      res.status(200).json({message:"Video saved successfully"});
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error:error});
  }
};

module.exports = {
  uploadProfile,
  uploadVideo
};