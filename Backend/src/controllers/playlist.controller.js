import {db } from "../libs/db.js"

export const getAllplaylistDetails = async (req,res) =>{
     try {
        const playlists = await db.playlists.findMany({
            where:{
                userid: req.user.id
            },
            include:{
                problems: {
                    include: {
                        problem: true
                    }
                }

            }
        })

        res.status(200).json({
            success:true,
            message: "playlists fetched successfully",
            playlists
        })
    } catch (error) {
        console.error("error fetching playlist", error);
        res.status(500).json({
            error: "fetching playlist error"
        })
        
    }

}

export const getplaylistDetails = async (req,res) =>{

    const {playlistId} = req.params;
      try {
        const playlist = await db.playlists.findUnique({
            where: {
                id: playlistId,
                userid: req.user.id

            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });

        if(!playlist){
            return res.status(404).json({
                error: "playlist not found"
            })
        }
        res.status(200).json({
            success:true,
            message: "playlist fetched successfully",
            playlist
        })
        
      } catch (error) {
        console.error("error fetching playlist details", error);
        res.status(500).json({
            error: "fetching playlist details error"
        })
      }
   
}

export const createPlaylist = async (req,res) => {
    try {
        
        const {name, description} = req.body;
        
    

        const userId = req.user.id;

        const playlist = await db.playlists.create({
            data : {
                userid: userId,
                name,
                description
            }
        });

        res.status(200).json({
            success: true,
            message: "playlist created successfully",
            playlist
        })
    }
        
     catch (error) {
        console.error("error creating playlist", error);
        res.status(500).json({
            error: "creating playlist error"
        })
    }
}

export const addProblemToPlaylist = async (req,res) => {
    const {playlistId} = req.params;
    const {problemIds} = req.body;

    try {
        console.log("Full req.params:", req.params);
        console.log("Full req.body:", req.body);
        console.log("Request data:", { playlistId, problemIds });
        
        if(!Array.isArray(problemIds)) {
            return res.status(400).json({
                error: "problemIds must be an array"
            })
        }

        if(problemIds.length === 0) {
            return res.status(400).json({
                error: "problemIds array cannot be empty"
            })
        }

        // record for each problem in playlist
        const problemsInPlaylist = await db.problemInPlaylist.createMany({
           data: problemIds.map((problemId) => ({
            playlistid: playlistId,
            problemid: problemId
           }))
        })

        console.log("Database result:", problemsInPlaylist);

        // createMany returns an object with count property, not null/undefined
        if(!problemsInPlaylist || problemsInPlaylist.count === 0) {
            return res.status(500).json({
                error: "adding problem to playlist error"
            })
        }

        res.status(201).json({
            success: true,
            message: "problem added to playlist successfully",
            problemsInPlaylist
        })

        
    } catch (error) {
        console.error("Error in addProblemToPlaylist:", error);
        res.status(500).json({
            error: "adding problem to playlist error"
        })
        
    }
}

export const deletePlaylist = async (req,res)  => {
    const {playlistId} = req.params;

    try {
        const deletedPlaylist = await db.playlists.delete({
            where: {
                id: playlistId,
                userid: req.user.id
            }
        })

        res.status(200).json({
            success: true,
            message: "playlist deleted successfully",
            deletedPlaylist
        })
        
    } catch (error) {
        console.error("error deleting playlist", error);
        res.status(500).json({
            error: "deleting playlist error"
        })
        
    }
}

export const removeproblemFromPlaylist = async (req, res) => {
    const {playlistId} = req.params;
    const {problemId} = req.body;

    try {
        if(!Array.isArray(problemId) || problemId.length === 0) {
            return res.status(400).json({
                error: "problemId must be an array with at least one element"
            })
        }

        const deletedProblems = await db.problemInPlaylist.deleteMany({
            where: {
                playlistid: playlistId,
                problemid: {
                    in: problemId
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "problem removed from playlist successfully",
            deletedProblems
        })
        
    } catch (error) {
        console.error("error removing problem from playlist", error);
        res.status(500).json({
            error: "removing problem from playlist error"
        })
        
    }
}