import { Annotations, CoreControls } from '@pdftron/webviewer';

export interface IDocument {
    serialDocument: string;
    signs: Array<sign>;
    document?: Uint8Array;
    signGuid: string;
    annotations: Array<IAnnotation>;
    docObject : CoreControls.Document;
    docStamp: Array<string>;
    solicitudFirmaToken: string;
    documentOriginator?: any;
    status?: string;
}

export interface IDocument2 {
    name:string;
    anotations:string;
    document: Uint8Array;
}

export interface sign {
    annotation: string;
    height: number;
    width: number;
    x: number;
    y: number;
    page: number;
    signatureGuid: string;
    signatureImageEncoded: string;
    signatureType: string
    signatureBase64: string
}

export interface ISignature {
    height: number;
    width: number;
    x: number;
    y: number;
    page: number;
    signatureGuid: string;
    signatureImageEncoded: string;
    signatureType: string
    signatureBase64: string
}

export interface IAnnotation {
    annotationObject: Annotations.Annotation;
    configured: boolean;
}

export enum AnnotationType {
    DATE = 1,
    INITIALS,
    TEXT,
    SIGNATURE
}
