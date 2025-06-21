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
  parsedText: string = '';
  fileName: string = '';
  url: string = '';
  extractedOutputFromURL: string = '';
  extractedOutputFromFile: string = '';
  durationInSeconds = 5;
  showLoader: boolean = false;

  private _snackBar = inject(MatSnackBar);

  constructor(private homeService: HomeService) { }


  // To be worked on -- WIP
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;

      if (file.type === 'application/x-subrip' || this.fileName.endsWith('.srt')) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result as string;
          this.parsedText = this.parseFileContent(fileContent);
        };
        reader.readAsText(file);
      }
      else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result as string;
          this.parsedText = this.parseFileContent(fileContent);
        };
        reader.readAsText(file);
      }
      else {
        alert('Please upload a valid .srt or .txt subtitle file.');
      }
    }
  }

  parseFileContent(data: string) {
    let subtitles = '';
    const entries = data.trim().split('\n\n');
    entries.forEach(entry => {
      const lines = entry.split('\n');
      subtitles = subtitles + lines.slice(2).join(' ')
    });
    console.log("subtitles", subtitles);
    return subtitles;
  }

  // Function to call API and pass video URL to fetch extracted notes
  extractSubtitles() {
    this.showLoader = true;
    if (this.selectedTabIndex == 0) {
      this.homeService.extractSubtitlesFromURL(this.url).subscribe((res: any) => {
        this.extractedOutputFromURL = res;
        this.showLoader = false;
        this.openSnackBar('Notes extracted successfully!', 3000, 'success-snackbar');
      }, error => {
        this.showLoader = false;
        this.openSnackBar('Error fetching subtitles from URL!', 3000, 'error-snackbar');
      })
    }
    else {
      this.homeService.extractSubtitlesFromFile(this.parsedText).subscribe((res: any) => {
        this.extractedOutputFromFile = res;
        this.showLoader = false;
        this.openSnackBar('Notes extracted successfully!', 3000, 'success-snackbar');
      }, error => {
        this.showLoader = false;
        this.openSnackBar('Error fetching subtitles from URL!', 3000, 'error-snackbar');
      })
    }
  }

  // Download the extracted notes in txt or pdf formats
  async downloadResponse(fileformat) {
    let filename = `Extracted Notes.${fileformat}`;
    let content = this.selectedTabIndex == 0 ? this.extractedOutputFromURL : this.extractedOutputFromFile
    if (fileformat == 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
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
        container.innerHTML = content;
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
