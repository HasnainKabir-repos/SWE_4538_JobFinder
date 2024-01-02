const Job = require('../model/Job');
const createJob = async(req, res) => {
    try {
        const { email} = req.user;

        const newJob = new Job({
            userEmail : email,
            jobName : req.body.jobName,
            jobCategory : "Job",
            jobDescription : req.body.jobDescription,
            jobDuration : req.body.jobDuration,
            price : req.body.price,
            keywords: req.body.keywords 
        });

        await newJob.save();

      res.status(200).send({ email : email,
        message: 'Job created successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Internal Server Error' });
    }

};

const getAllJobs = async(req, res) => {
    try {
        const jobs = await Job.find().sort({datePosted: -1});
        return res.json(jobs);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving jobs', error: error });
    }
};

const searchByKeywords = async(req, res) => {
    try{
        const { keywords, jobType, minPrice, maxPrice } = req.query;
    
        let query = {
          keywords: {$in : keywords}
        };
    
        if(jobType){
          query.jobDuration = jobType;
        }
    
        if (minPrice && maxPrice) {
    
          query.price = { $gte: minPrice, $lte: maxPrice };
    
        } else if (minPrice) {
    
          query.price = { $gte: minPrice };
    
        } else if (maxPrice) {
          
          query.price = { $lte: maxPrice };
        }
    
        const jobs = await Job.find(query).sort( {datePosted: -1});
        return res.json(jobs);
    
    }catch(error){
        return res.status(500).json({ message: 'Error retrieving jobs', error: error});
    }
};

const getKeywords = async(req, res) => {
    try{
        const mostFrequentKeywords = await Job.aggregate([
          { $unwind: "$keywords" },
          { $group: { _id: "$keywords", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 } 
        ]);
    
        return res.json(mostFrequentKeywords);
    }catch (error){
        return res.status(500).json({message: 'Error retrieving relevant keywords', error: error});
    }
};

const updateJob = async(req, res) => {

    try{
        const job = await Job.findById(req.body.id);

        if(req.body.jobName){
            job.jobName = req.body.jobName;
        }
        if(req.body.jobDescription){
            job.jobDescription = req.body.jobDescription;
        }
        if(req.body.jobDuration){
            job.jobDuration = req.body.jobDuration;
        }
        if(req.body.price){
            job.price = req.body.price;
        }

        await job.save();
        res.status(200).json({message:"Job updated successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}

const deleteJob = async(req, res) => {
    try{
        const job = req.body.id;
    
        await Job.deleteOne({_id: job});
    
        return res.json({message: "job deleted successfully"});
    }catch(error){
        return res.status(500).json({message: 'Error deleting job', error: error});
    }
};

module.exports = {
    createJob,
    getAllJobs,
    searchByKeywords,
    getKeywords,
    deleteJob,
    updateJob
};