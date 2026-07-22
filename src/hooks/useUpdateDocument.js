import { useState, useEffect, useReducer } from 'react'
import { db } from '../firebase/config'
import { updateDoc, doc } from 'firebase/firestore'

const initialState = {
    loading: null,
    error: null
}
const updateReducer = (state, action) => {
    switch (action.type) {
        case "LOADING":
            return { loading: true, error: null }
        case "UPDATED_DOC":
            return { loading: false, error: null }
        case "ERROR":
            return { loading: false, error: action.payload }
        default:
            return state
    }
}
export const useUpdateDocument = (docCollection) => {
    const [response, dispatch] = useReducer(updateReducer, initialState)

    //deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    const checkICancelBeforeDispatch = (action) => {
        if (!cancelled) {
            dispatch(action)
        }
    }
    const updateDocument = async (id, data) => {
        checkICancelBeforeDispatch({ type: "LOADING" })

        try {
            const docRef = await doc(db, docCollection, id)
            const updatedDocument = await updateDoc(docRef, data);
            checkICancelBeforeDispatch({ type: "UPDATED_DOC", payload: updatedDocument })
        } catch (error) {
            console.log(error.message)
            checkICancelBeforeDispatch({ type: "ERROR", payload: error.message })
        }
    }
    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    //O return do hook é um objeto com a função insertDocument e o estado response, que contém informações sobre o status da operação de inserção de documento no Firestore.
    return { updateDocument, response };
}