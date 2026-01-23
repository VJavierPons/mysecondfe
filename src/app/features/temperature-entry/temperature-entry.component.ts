import { Component, inject, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../core/services/weather.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  

@Component({
  selector: 'app-temperature-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './temperature-entry.component.html',
  styleUrl: './temperature-entry.component.css'
})
export class TemperatureEntryComponent implements OnInit, AfterViewInit {
  private weatherService = inject(WeatherService);
  private cdr = inject(ChangeDetectorRef);

  temperatureC: number | null = null;
  summary: string = '';
  showDeletePanel = false;
  deleteId: string = '';
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'temperatureC', 'summary'];
  currentId: string | null = null;

  @ViewChild('paginator') paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.onGet();
  } 

  onAdd() {
    if (this.temperatureC !== null && this.summary.trim()) {
      this.currentId = this.currentId; // Store currentId for potential future use
      this.weatherService.addWeatherData(this.temperatureC, this.summary).subscribe({
        next: (res) => {
          console.log('Weather data added', res);
          this.temperatureC = null;
          this.summary = '';
          this.onGet();
        },
        error: (err) => console.error('Error adding weather data', err)
      });
    } else {
      console.warn('Please provide both temperature and summary');
    }
  }

  toggleDeletePanel() {
    this.showDeletePanel = !this.showDeletePanel;
  }

  onDelete() {
    if (this.deleteId.trim()) {
      this.weatherService.deleteWeatherData(this.deleteId).subscribe({
        next: (res) => {
          console.log('Weather data deleted', res);
          this.deleteId = '';
          this.showDeletePanel = false;
          this.onGet();
        },
        error: (err) => console.error('Error deleting weather data', err)
      });
    }
  }

  onGet() {
    this.isLoading = true;
    this.weatherService.getWeatherData().subscribe({
      next: (res: any) => {
        console.log('Weather data retrieved', res);
        this.dataSource.data = res;
        
        // Use timeout to ensure the DOM is updated and ViewChild is linked
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        });
        

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error retrieving weather data', err);
        this.isLoading = false;
      }
    });
  }
}
console.log('TemperatureEntryComponent loaded');