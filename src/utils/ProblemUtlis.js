

const getIdByLanguage=(lang)=>{
    const languageWithId = {
        "c":50,
        "c++":54,
        "java":62,
        "javascript":63,
        "python":70,
        "rust":73
    }
    return languageWithId[lang.toLowerCase()];
}


const submitBatch = (sub )=>{

}
module.exports=getIdByLanguage;