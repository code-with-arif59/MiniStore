import Adress from "../model/Adress.js";


//! save adress

export async function saveAdress(req,res) {
    try {
        const adress = await Adress.create(req.body);
        res.json({message : "Adress Save Successfully",adress})
        
    } catch (error) {
        res.status(500).json({
            message : "Error Saving Adress",
            error
        })
    }
}

//! get user by userId

export async function getAddress(req,res) {
    try {
        const address = await Adress.find({userId : req.params.userId})
        res.json(address)
    } catch (error) {
             res.status(500).json({
            message : "Error Fetching Adress",
            error
        })
    }
}


export async function updateAddress(req, res) {
  try {
    const address = await Adress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Address Updated Successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Updating Address",
      error,
    });
  }
}