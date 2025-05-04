export interface Settings {
  id?: string;
  bgDesktop: string;
  bgPhone: string;
  textColor: string;
  buttonColor: string;
}

export interface AddSettings {
  bgDesktop: string;
  bgPhone?: string;
  textColor?: string;
  buttonColor?: string;
}

export interface UpdateLanguage {
  language: string;
}
