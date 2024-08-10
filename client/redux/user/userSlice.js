import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false 
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false,
            state.error = null 
        },
        signInFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },

        // sign up reducer

        signUpStart: (state) => {
            state.loading = true 
            state.error = false
        }, 
        signUpSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false 
            state.error = null
        },
        signUpFailure: (state, action) => {
            state.error = action.payload
            state.loading = false 
        }, 

        // updating user
        updateStart: (state) => {
            state.loading = true
            state.error = false
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false 
            state.error = false 
        },
        updateFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },


        // sign out 

        signOutStart: (state) => {
            state.error = null
            state.loading = false 
        },
        signOutSuccess: (state) => {
            state.currentUser = null
            state.error = null
            state.loading = false 
        },
        signOutFailure: (state, action) => {
            state.error = action.payload
            state.loading = false 
        },
    }
})


export const {
    signInStart, signInSuccess, signInFailure,
    signUpStart, signUpSuccess, signUpFailure,
    updateStart, updateSuccess, updateFailure,
    signOutStart, signOutSuccess, signOutFailure
} = userSlice.actions


export default userSlice.reducer