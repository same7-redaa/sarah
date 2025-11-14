# 🎯 دليل سريع - لوحة التحكم

## 🚀 البدء السريع

### 1. إعداد Firebase (مرة واحدة فقط)

#### أ) تفعيل Authentication
1. افتح https://console.firebase.google.com
2. اختر مشروع **sara-a3a18**
3. Authentication → Get Started
4. فعّل **Email/Password**
5. أضف مستخدم (البريد + كلمة المرور)

#### ب) إعداد Firestore
1. Firestore Database → Create database
2. اختر **Production mode**
3. انسخ المحتوى من ملف `firestore.rules`
4. الصقه في **Rules**
5. اضغط **Publish**

### 2. الدخول إلى لوحة التحكم
افتح ملف: **`admin-control.html`**

### 3. تسجيل الدخول
استخدم البريد وكلمة المرور من خطوة 1-أ-5

---

## 📦 المميزات

### ✨ قصص النجاح
- إضافة صور جديدة
- تعديل الصور الموجودة  
- حذف الصور
- محول تلقائي لروابط Google Drive

### 🏢 شعارات العملاء
- إضافة شعارات جديدة
- تعديل الشعارات الموجودة
- حذف الشعارات
- محول تلقائي لروابط Google Drive

---

## 🔗 قواعد Firestore (انسخها)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /testimonials/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    match /clients/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**أو انسخ محتوى ملف**: `firestore.rules`

---

## ❌ حل الخطأ الشائع

### "Missing or insufficient permissions"

**السبب**: قواعد Firestore غير منشورة

**الحل**:
1. ✅ افتح Firebase Console
2. ✅ Firestore Database → Rules
3. ✅ انسخ القواعد من `firestore.rules`
4. ✅ اضغط **Publish**
5. ✅ انتظر دقيقة وحدّث الصفحة

---

## 📁 الملفات المهمة

| الملف | الوصف |
|------|-------|
| `admin-control.html` | لوحة التحكم الرئيسية |
| `firebase-config.js` | إعدادات Firebase |
| `firestore.rules` | قواعد الأمان (انسخها) |
| `testimonials-loader.js` | محمل قصص النجاح |
| `clients-loader.js` | محمل شعارات العملاء |

---

## 🔐 الأمان

- ✅ تسجيل دخول إجباري
- ✅ حماية كاملة للبيانات
- ✅ القراءة فقط للزوار
- ✅ الكتابة للمصادقين فقط

---

## 📞 مساعدة إضافية

راجع: **`FIREBASE_SETUP_PRODUCTION.md`** للتفاصيل الكاملة
