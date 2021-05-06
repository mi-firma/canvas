// This file contains utility functions related to pdf and image manipulation

import * as Utils from 'src/app/Utilidades/utils';
import { PDFImage, PDFDocument } from 'pdf-lib';
import { Point } from '../modelos/point.model';
import { Dimension } from '../modelos/dimension.model';

/**
 * Draws an image on the pdf at the specified location
 *
 * @param pdfsrc pdf que se va a modificar
 * @param coordinates Coordenadas de la imagen sobre el pdf
 * @param dimensions Dimensiones de la imagen con respecto al pdf
 * @param page Pagina sobre la que se va a dibujar
 */
export async function drawImageOnPDF(pdfsrc: Uint8Array, coordinates: Point,
                                     dimensions: Dimension, page: number, img: string): Promise<Uint8Array> {
  return new Promise(resolve => {
    {
      (async () => {
        const ext = Utils.getExtensionImageFromURI(img);

        let image: PDFImage;
        const pdfDoc = await PDFDocument.load(pdfsrc);

        if (ext === 'png') {
          const pngImageBytes = await fetch(img).then((res) => res.arrayBuffer());

          image = await pdfDoc.embedPng(pngImageBytes);
        } else if (ext === 'jpg' || ext === 'jpeg') {
          const jpgImageBytes = await fetch(img).then((res) => res.arrayBuffer());

          image = await pdfDoc.embedJpg(jpgImageBytes);
        }

        const pageObj = pdfDoc.getPages()[page];

        // Dibuja la imagen de la firma sobre el PDF.
        pageObj.drawImage(image, {
          x: coordinates.x,
          y: coordinates.y,
          width: dimensions.width,
          height: dimensions.height
        });

        const pdfBytes = await pdfDoc.save();
        resolve(pdfBytes);
      })();
    }
  });
}

