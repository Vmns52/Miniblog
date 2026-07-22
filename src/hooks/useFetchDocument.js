import{useState, useEffect}from"react";
import{db}from"../firebase/config";
import{doc, getDoc}from"firebase/firestore";

export const useFetchDocument=(docCollection, id)=>{
    const [document,setDocument]=useState(null);
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(null);

    //deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    useEffect(()=>{
        async function loadDoc(){
            if(cancelled) return;

            setLoading(true);

           

            try {
                const docRef = await doc(db, docCollection, id);
                const docSnap = await getDoc(docRef);

                setDocument({ id: docSnap.id, ...docSnap.data() });
                
                setLoading(false);
            } catch (error) {
                console.log(error.message);
                setError(error.message);
                setLoading(false);
            } 
        }
        loadDoc();
    }, [docCollection, id, cancelled]);

    useEffect(() => { 
        return () => setCancelled(true)
    }, []);

    return { document, loading, error };
}

