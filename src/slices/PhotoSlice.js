import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/PhotoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

//publish a photo
export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.publishPhoto(photo, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

//get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getUserPhotos(id, token);

    if (data.errors) {
      return console.log(data.errors);
    }

    return data;
  }
);

//delete a photo
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.deletePhoto(id, token);

    console.log(data);

    if (data.errors) {
      return console.log(data.errors);
    }

    return data;
  }
);

//update photo
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );

    console.log(data);

    if (data.errors) {
      return console.log(data.errors);
    }

    return data;
  }
);

//get photo by id
export const getPhoto = createAsyncThunk(
  "photo/getPhoto",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getPhoto(id, token);

    if (data.errors) {
      return console.log(data.errors);
    }

    return data;
  }
);

//like a photo
export const likePhoto = createAsyncThunk(
  "photo/like",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.likePhoto(id, token);

    return data;
  }
);

//comment on a photo
export const comment = createAsyncThunk(
  "photo/comment",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.comment(
      { comment: commentData.comment },
      commentData.id,
      token
    );

    if (data.errors) {
      return console.log(data.errors);
    }

    return data;
  }
);

//get all photos
export const getAllPhotos = createAsyncThunk(
  "photo/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getAllPhotos(token);

    if (data.errors) {
      return console.log(data.errors);
    }

    return data;
  }
);

//get photo by id
export const searchPhoto = createAsyncThunk(
  "photo/search",
  async (query, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.searchPhoto(query, token);

    if (data.errors) {
      return console.log(data.errors);
    }

    return data;
  }
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Photo published successfully!";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(likePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        if (state.photo.likes) {
          state.photo.likes.push(action.payload.userId);
        }

        state.photos.map((photo) => {
          if (photo._id === action.payload.photoId) {
            return photo.likes.push(action.payload.userId);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(likePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photo.comments.push(action.payload.comment);

        state.message = action.payload.message;
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(searchPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
