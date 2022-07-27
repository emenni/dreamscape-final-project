import { IOClients } from "@vtex/api";
import { OMS } from "@vtex/clients";
import Suggestion from "./suggestion";
import { Profile } from "./profile";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get suggestion() {
    return this.getOrSet('suggestion', Suggestion)
  }
  public get order() {
    return this.getOrSet('order', OMS)
  }
  public get profile() {
    return this.getOrSet('profile', Profile)
  }
}
