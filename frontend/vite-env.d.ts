/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Aggiungi altre variabili qui se ne hai
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
