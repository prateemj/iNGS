import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { HomeService } from './home.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-home',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatTabsModule, CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Required Variables
  selectedTabIndex = 0
  fileName: string = '';
  url: string = '';
  extractedOutput: string = '';
  durationInSeconds = 5;
  showLoader: boolean = false;

  private _snackBar = inject(MatSnackBar);

  constructor(private homeService: HomeService) { }

  // To be worked on -- WIP
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    }
  }

  // Function to call API and pass video URL to fetch extracted notes
  extractSubtitlesFromUrl() {
    this.showLoader = true;
    this.homeService.extractSubtitlesFromURL(this.url).subscribe((res: any) => {
      this.extractedOutput = res;
      this.showLoader = false;
      this.openSnackBar('Notes extracted successfully!', 150000, 'success-snackbar');
    }, error => {
      this.showLoader = false;
      this.openSnackBar('Error fetching subtitles from URL!', 5000, 'error-snackbar');
    })
  }

  // Download the extracted notes in txt or pdf formats
  async downloadResponse(fileformat) {
    let filename = `Extracted Notes.${fileformat}`;
    if (fileformat == 'txt') {
      const blob = new Blob([this.extractedOutput], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      window.URL.revokeObjectURL(url);
    }
    else {
      if (typeof window !== 'undefined') {
        const html2pdf = (await import('html2pdf.js')).default;

        const container = document.createElement('pre');
        container.innerHTML = this.extractedOutput;
        container.style.padding = '20px';
        document.body.appendChild(container);

        const options = {
          margin: 0,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(options).from(container).save();
        document.body.removeChild(container);
      }
    }
  }

  // Opens snackbar based on API response
  openSnackBar(message: string, duration: number, panelclass: string) {
    this._snackBar.open(message, 'X',
      {
        duration: duration,
        panelClass: [panelclass],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
  }
}
