import { Kentico } from "./kentico";
import { MyCompany } from "./mycompany";

declare global {
  interface Window {
    kentico: Kentico,
    MyCompany: MyCompany,
  }
}