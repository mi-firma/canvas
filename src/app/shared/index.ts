import { NoServiceComponent } from './components/no-service/no-service.component';
import { SafeUrlPipe } from './pipes/safe-url/safe-url.pipe';
import { CustomizeSignatureComponent } from './components/customize-signature/customize-signature/customize-signature.component';
import { SignaturesListComponent } from './components/signatures-list/signatures-list.component';
import { TimeUnitPipe } from './pipes/time-unit/time-unit.pipe';

/**
 * Shared components
 */
export const SHARED_COMPONENTS: any[] = [
    NoServiceComponent,
    CustomizeSignatureComponent,
    SignaturesListComponent
];

export const SHARED_PIPES: any[] = [
    SafeUrlPipe,
    TimeUnitPipe
];

export * from './components/no-service/no-service.component';
export * from './components/customize-signature/customize-signature/customize-signature.component';
export * from './components/signatures-list/signatures-list.component';

export * from './pipes/safe-url/safe-url.pipe';
