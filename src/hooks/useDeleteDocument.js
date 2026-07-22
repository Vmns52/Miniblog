import { useState, useEffect, useReducer } from 'react'
import { db } from '../firebase/config'
import { doc, deleteDoc } from 'firebase/firestore'

const initialState = {
    loading: null,
    error: null
}
const deleteReducer = (state, action) => {
    switch (action.type) {
        case "LOADING":
            return { loading: true, error: null }
        case "DELETED_DOC":
            return { loading: false, error: null }
        case "ERROR":
            return { loading: false, error: action.payload }
        default:
            return state
    }
}
export const useDeleteDocument = (docCollection) => {
    const [response, dispatch] = useReducer(deleteReducer, initialState)

    //deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    const checkICancelBeforeDispatch = (action) => {
        if (!cancelled) {
            dispatch(action)
        }
    }
    const deleteDocument = async (id) => {
        checkICancelBeforeDispatch({ type: "LOADING" })

        try {

            const deleteDocument = await deleteDoc(
                doc(db, docCollection, id)
            )
            checkICancelBeforeDispatch({ type: "DELETED_DOC", payload: deleteDocument })
        } catch (error) {
            console.log(error.message)
            checkICancelBeforeDispatch({ type: "ERROR", payload: error.message })
        }
    }
    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    //O return do hook é um objeto com a função deleteDocument e o estado response, que contém informações sobre o status da operação de exclusão de documento no Firestore.
    return { deleteDocument, response };
}