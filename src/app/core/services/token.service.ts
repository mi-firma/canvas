import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppTokenService {
    private token = "token";

    clear(): void {
        localStorage.removeItem(this.token);
    }

    any(): boolean {
        return this.get() !== null;
    }

    get(): string | null {
        return localStorage.getItem(this.token);
    }

    set(token: string): void {
        localStorage.setItem(this.token, token);
    }
}
