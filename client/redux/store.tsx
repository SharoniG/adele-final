import { configureStore, createSlice ,type PayloadAction} from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const initialState: User | null = JSON.parse(localStorage.getItem("user") || "null"); // אם המשתמש התחבר קודם אז שולפים את המידע ואם לא אז הסטייט ההתחלתי יהיה ריק


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload)); //אם יש משתמש – שומר אותו גם ללוקאל כדי שיישמר גם אחרי רענון הדף
      } else {
        localStorage.removeItem("user"); // אם נאל מוחק את המתמש
      }
      return action.payload;
    },
    logoutUser(){
      localStorage.removeItem("user"); //מוחקת את המשתמש מהלוקאל
      return null; 
    },
  },
});
 

const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");//טוענים את העגלה מתוך הלוקאל אם אין אז מערך ריק

const cartSlice = createSlice({
  name: "cart",
  initialState: savedCart,
  reducers: {

    addToCart(state, action) {
      const code = action.payload.productCode;
      const found = state.find(item => item.productCode === code); //אם יש קוד מוצר דומה בעגלה
      if (found) {
        found.quantity++;//מעלים באחת את הכמות
      } else {
        state.push({ ...action.payload, quantity: 1 });//מוסיפים אותו עם כמות 1
      }
    
      localStorage.setItem("cart", JSON.stringify(state));  //  שבכל שינוי העגלה נשמרת בלוקאל 
     },

    removeFromCart(state, action) {
      const newState = state.filter(item => item.productCode !== action.payload); // בגלל שהעברנו את קוד המוצר אז הוא יותר עגלה חדשה בלי המוצר הזה
      localStorage.setItem("cart", JSON.stringify(newState)); 
      return newState; // החזרת העגלה החדשר
    },
    clearCart() {
      localStorage.removeItem("cart"); // מחיקת העגלה מהלוקאל
      return [];
    },
    updateQuantity(state, action) {
      const { productCode, quantity } = action.payload;
      const item = state.find(i => i.productCode === productCode);  // אם יש מוצר קיים בעגלה אז תעדכן 
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});


const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer,
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export const { addToCart, removeFromCart, clearCart , updateQuantity } = cartSlice.actions;
export type RootState = ReturnType<typeof store.getState>;

export default store;
