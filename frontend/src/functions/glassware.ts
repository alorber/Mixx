import { getAllGlassware, Glassware } from "../services/api";

// Helper Functions for Glassware

////////////////////////////////////////////////////////////
//      Loading Glassware
///////////////////////////////////////////////////////////

// Get All Glassware
export const getGlasswareList = async (
    setErrorCode: (e: number | null) => void,
    onSuccess: (g: Glassware[]) => void
) => {
    const resp = await getAllGlassware();
        if(resp.status === "Success") {
            setErrorCode(null);
            onSuccess(resp.glassware);
        } else {
            setErrorCode(resp.errorCode);
        }
}

// Build Glassware Dict: ID -> Glassware
export const buildGlasswareDict = async (
    setErrorCode: (e: number | null) => void,
    setGlasswareDict: (g: {[key: string]: Glassware}) => void, 
) => {
    await getGlasswareList(setErrorCode, (glasswareList: Glassware[]) => {
        // Build dict
        const idToGlassware: {[key: string]: Glassware} = {};
        for(const glass of glasswareList) {
            idToGlassware[glass._id] = glass;
        }
        setGlasswareDict(idToGlassware);
    })
}