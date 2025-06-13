import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _loading = signal<boolean>(false);
  private readonly _loadingCount = signal<number>(0);

  readonly loading = computed(() => this._loading());
  readonly isLoading = computed(() => this._loadingCount() > 0);

  setLoading(loading: boolean): void {
    if (loading) {
      this._loadingCount.update((count) => count + 1);
    } else {
      this._loadingCount.update((count) => Math.max(0, count - 1));
    }

    this._loading.set(this._loadingCount() > 0);
  }
}
