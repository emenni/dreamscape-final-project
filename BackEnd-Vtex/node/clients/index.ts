import { IOClients } from "@vtex/api";
import { OMS } from "@vtex/clients";
import Combination from "./combination";
import MasterDataCustom from "./MasterDataCustom";
import { Profile } from "./profile";
import TestHelloWorld from "./testHelloWorld";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get combination() {
    return this.getOrSet('combination', Combination)
  }
  public get order() {
    return this.getOrSet('order', OMS)
  }
  public get profile() {
    return this.getOrSet('profile', Profile)
  }
  public get testHelloWorld() {
    return this.getOrSet('profile', TestHelloWorld)
  }
  public get masterDataCustom() {
    return this.getOrSet('masterDataCustom', MasterDataCustom)
  }
}
