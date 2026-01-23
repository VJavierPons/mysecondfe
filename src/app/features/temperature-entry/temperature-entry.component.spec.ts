import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, throwError } from 'rxjs';
import { TemperatureEntryComponent } from './temperature-entry.component';
import { WeatherService } from '../../core/services/weather.service';
import { vi, expect } from 'vitest';

describe('TemperatureEntryComponent', () => {
  let component: TemperatureEntryComponent;
  let fixture: ComponentFixture<TemperatureEntryComponent>;
  let weatherService: any;

  const mockWeatherData = [
    { id: '1', temperatureC: 25, summary: 'Sunny' },
    { id: '2', temperatureC: 18, summary: 'Cloudy' }
  ];

  beforeEach(async () => {
    const weatherServiceSpy = {
      addWeatherData: vi.fn(),
      deleteWeatherData: vi.fn(),
      getWeatherData: vi.fn().mockReturnValue(of(mockWeatherData))
    };

    await TestBed.configureTestingModule({
      imports: [
        TemperatureEntryComponent,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: WeatherService, useValue: weatherServiceSpy }
      ]
    }).compileComponents();

    weatherService = TestBed.inject(WeatherService);
    fixture = TestBed.createComponent(TemperatureEntryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize with default values', () => {
    expect(component.temperatureC).toBeNull();
    expect(component.summary).toBe('');
    expect(component.showDeletePanel).toBe(false);
    expect(component.deleteId).toBe('');
    expect(component.isLoading).toBe(false);
  });

  it('should load weather data on init', () => {
    weatherService.getWeatherData.mockReturnValue(of(mockWeatherData));
    fixture.detectChanges();
    expect(weatherService.getWeatherData).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockWeatherData);
  });

  it('should add weather data successfully', () => {
    const newData = { id: '3', temperatureC: 22, summary: 'Rainy' };
    component.temperatureC = 22;
    component.summary = 'Rainy';
    
    weatherService.addWeatherData.mockReturnValue(of(newData));
    weatherService.getWeatherData.mockReturnValue(of([...mockWeatherData, newData]));
    
    component.onAdd();
    
    expect(weatherService.addWeatherData).toHaveBeenCalledWith(22, 'Rainy');
    expect(component.temperatureC).toBeNull();
    expect(component.summary).toBe('');
    expect(weatherService.getWeatherData).toHaveBeenCalled();
  });

  it('should not add weather data if temperature is null', () => {
    component.temperatureC = null;
    component.summary = 'Test';
    
    const spy = vi.spyOn(console, 'warn'); // Cambiado de spyOn
    component.onAdd();
    
    expect(weatherService.addWeatherData).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('Please provide both temperature and summary');
  });

  it('should not add weather data if summary is empty', () => {
    component.temperatureC = 20;
    component.summary = '';
    
    vi.spyOn(console, 'warn'); // Cambiar spyOn por vi.spyOn
    component.onAdd();
    
    expect(weatherService.addWeatherData).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('Please provide both temperature and summary');
  });

  it('should toggle delete panel', () => {
    expect(component.showDeletePanel).toBe(false); // Cambiado
    
    component.toggleDeletePanel();
    expect(component.showDeletePanel).toBe(true); // Cambiado de toBeTrue()
    
    component.toggleDeletePanel();
    expect(component.showDeletePanel).toBe(false); // Cambiado
  });

  it('should delete weather data successfully', () => {
    const deleteId = '1';
    component.deleteId = deleteId;
    component.showDeletePanel = true;
    
    weatherService.deleteWeatherData.mockReturnValue(of({}));
    weatherService.getWeatherData.mockReturnValue(of([mockWeatherData[1]]));
    
    component.onDelete();
    
    expect(weatherService.deleteWeatherData).toHaveBeenCalledWith(deleteId);
    expect(component.deleteId).toBe('');
    expect(component.showDeletePanel).toBe(false); // Cambiar toBeFalse() por toBe(false)
    expect(weatherService.getWeatherData).toHaveBeenCalled();
  });

  it('should not delete if deleteId is empty', () => {
    component.deleteId = '';
    
    component.onDelete();
    
    expect(weatherService.deleteWeatherData).not.toHaveBeenCalled();
  });

  it('should handle error when adding weather data', () => {
    component.temperatureC = 22;
    component.summary = 'Test';
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); 
    weatherService.addWeatherData.mockReturnValue(throwError(() => new Error('Add error')));
    
    component.onAdd();
    
    expect(consoleSpy).toHaveBeenCalledWith('Error adding weather data', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle error when getting weather data', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    weatherService.getWeatherData.mockReturnValue(throwError(() => new Error('Get error')));
    
    component.onGet();
    
    expect(consoleSpy).toHaveBeenCalledWith('Error retrieving weather data', expect.any(Error));
    expect(component.isLoading).toBe(false);
    consoleSpy.mockRestore();
  });

  // Nuevo test para verificar el h1 que sí está en este componente
  it('should render the main title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('mysecondfe');
  });
  
  it('should display correct columns in table', () => {
    expect(component.displayedColumns).toEqual(['id', 'temperatureC', 'summary']);
  });
});
