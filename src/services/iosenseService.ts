import { DataAccess, EventsHandler, DeviceMetadata, DeviceDetail, UserInfo, MongoDataOptions } from 'connector-userid-ts';

// Configuration for the specific account
const ACCOUNT_ID = '6710eea3340f9be7ffa61634';
const DATA_URL = 'datads.iosense.io';

// Configuration interface for the app
export interface AppConfiguration {
  planningDeviceId: string;
  masterDataDeviceId: string;
  sensorId: string;
  deviceType: string;
  accountId: string;
}

// Device option interface for dropdowns
export interface DeviceOption {
  value: string;
  label: string;
  metadata: DeviceMetadata;
}

class IoSenseService {
  private dataAccess: DataAccess;
  private eventsHandler: EventsHandler;
  private readonly storageKey = 'mould-ai-config';

  constructor() {
    this.dataAccess = new DataAccess({
      userId: ACCOUNT_ID,
      dataUrl: DATA_URL,
      dsUrl: DATA_URL
    });

    this.eventsHandler = new EventsHandler({
      userId: ACCOUNT_ID,
      dataUrl: DATA_URL
    });
  }

  // Fetch all devices for the account
  async getDevices(): Promise<DeviceOption[]> {
    try {
      console.log('Fetching device details...');
      const deviceDetails = await this.dataAccess.getDeviceDetails() as DeviceDetail[];
      
      if (!Array.isArray(deviceDetails) || deviceDetails.length === 0) {
        console.warn('No device details found');
        return [];
      }

      const deviceOptions: DeviceOption[] = [];

      // Get metadata for each device
      for (const device of deviceDetails) {
        try {
          const metadata = await this.dataAccess.getDeviceMetaData(device.devID) as DeviceMetadata;
          if (metadata && metadata.devName) {
            deviceOptions.push({
              value: device.devID,
              label: `${metadata.devName} (${device.devID})`,
              metadata
            });
          }
        } catch (error) {
          console.warn(`Failed to get metadata for device ${device.devID}:`, error);
        }
      }

      console.log(`Successfully fetched ${deviceOptions.length} devices`);
      return deviceOptions;
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw new Error('Failed to fetch devices from IoSense API');
    }
  }

  // Get user information
  async getUserInfo(): Promise<UserInfo> {
    try {
      const userInfo = await this.dataAccess.getUserInfo() as UserInfo;
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user information');
    }
  }

  // Save configuration to local storage
  saveConfiguration(config: AppConfiguration): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(config));
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw new Error('Failed to save configuration');
    }
  }

  // Load configuration from local storage
  loadConfiguration(): AppConfiguration | null {
    try {
      const configStr = localStorage.getItem(this.storageKey);
      if (!configStr) {
        return null;
      }
      const config = JSON.parse(configStr) as AppConfiguration;
      console.log('Configuration loaded successfully');
      return config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      return null;
    }
  }

  // Check if configuration exists
  hasConfiguration(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }

  // Clear configuration
  clearConfiguration(): void {
    localStorage.removeItem(this.storageKey);
    console.log('Configuration cleared');
  }

  // Get sensor data for a device
  async getSensorData(deviceId: string, sensorList?: string[], startTime?: Date, endTime?: Date) {
    try {
      const data = await this.dataAccess.dataQuery({
        deviceId,
        sensorList,
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
        cal: true,
        alias: true
      });
      return data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw new Error('Failed to fetch sensor data');
    }
  }

  // Get latest sensor data points
  async getLatestSensorData(deviceId: string, sensorList?: string[], count: number = 10) {
    try {
      const data = await this.dataAccess.getDp({
        deviceId,
        sensorList,
        n: count,
        cal: true,
        alias: true
      });
      return data;
    } catch (error) {
      console.error('Error fetching latest sensor data:', error);
      throw new Error('Failed to fetch latest sensor data');
    }
  }

  // Get mould data from MongoDB using master device and sensor configuration
  async getMouldData(masterDeviceId: string, sensorId: string): Promise<string[]> {
    try {
      console.log(`Fetching mould data for device ${masterDeviceId}, sensor ${sensorId}...`);
      
      const data = await this.eventsHandler.getMongoData({
        devID: masterDeviceId,
        limit: 1000
      });

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('No mould data found');
        return [];
      }

      // Extract unique values for the specified sensor
      const sensorValues = new Set<string>();
      
      data.forEach(record => {
        if (record.data && record.data[sensorId]) {
          const value = record.data[sensorId];
          // Only add non-null, non-empty string values
          if (value && typeof value === 'string' && value.trim() !== '' && value !== 'nan' && value !== 'null') {
            sensorValues.add(value.trim());
          }
        }
      });

      const uniqueValues = Array.from(sensorValues).sort();
      console.log(`Found ${uniqueValues.length} unique mould values`);
      return uniqueValues;
    } catch (error) {
      console.error('Error fetching mould data:', error);
      throw new Error('Failed to fetch mould data from MongoDB');
    }
  }

  // Get machine data from MongoDB using planning device and filter by selected mould
  async getMachineData(planningDeviceId: string, selectedMould: string): Promise<any[]> {
    try {
      console.log(`Fetching machine data for device ${planningDeviceId}, mould ${selectedMould}...`);
      
      const data = await this.eventsHandler.getMongoData({
        devID: planningDeviceId,
        limit: 10000
      });

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('No machine data found');
        return [];
      }

      // Filter data by F2 field matching the selected mould
      const filteredData = data.filter(record => {
        return record.data && record.data.F2 === selectedMould;
      });

      // Map the MongoDB fields to machine card format
      const mappedMachines = filteredData.map((record, index) => {
        const data = record.data;
        
        // Field mapping as provided
        const availability = parseFloat(data.D53) || 0;
        const performance = parseFloat(data.D54) || 0;
        const quality = parseFloat(data.D55) || 0;
        
        // Calculate OEE and determine category
        const oee = (availability * performance * quality) / 10000; // Assuming values are percentages
        let oeeCategory = 'average';
        if (oee >= 90) oeeCategory = 'best';
        else if (oee >= 70) oeeCategory = 'good';

        // Determine status based on availability
        const status = availability >= 80 ? 'Available' : 'Unavailable';

        return {
          id: record._id || `machine-${index}`,
          name: data.F1 || `Machine ${index + 1}`, // F1 might contain machine name
          status,
          oeeCategory,
          oee, // Add OEE for comparison
          lastProduction: {
            startTime: data.D52 || 'N/A', // Assuming D52 might be start time
            endTime: data.D53 || 'N/A',
            duration: 'N/A', // Could be calculated if we have start/end times
            targetQty: parseInt(data.D56) || 0, // total_reason_quantity
            actualQty: parseInt(data.D56) || 0, // May need different field
            availability: Math.round(availability),
            performance: Math.round(performance),
            quality: Math.round(quality),
            rejectionQty: parseInt(data.D59) || 0, // Rejection_reason_count
            downtimeMinutes: parseInt(data.D61) || 0, // Downtime_reason_duration
            topRejectionReason: data.D58 || 'Unknown', // Rejection_reason
            topDowntimeReason: data.D60 || 'Unknown' // common_downtime_reason
          }
        };
      });

      // Group machines by name and keep only the one with highest OEE for each name
      const uniqueMachinesMap = new Map();
      
      mappedMachines.forEach(machine => {
        const machineName = machine.name;
        
        if (!uniqueMachinesMap.has(machineName)) {
          // First machine with this name
          uniqueMachinesMap.set(machineName, machine);
        } else {
          // Compare OEE and keep the better one
          const existingMachine = uniqueMachinesMap.get(machineName);
          if (machine.oee > existingMachine.oee) {
            uniqueMachinesMap.set(machineName, machine);
          }
        }
      });

      // Convert back to array and remove the OEE field (we don't need it in the final result)
      const uniqueMachines = Array.from(uniqueMachinesMap.values()).map(machine => {
        const { oee, ...machineWithoutOee } = machine;
        return machineWithoutOee;
      });

      console.log(`Found ${uniqueMachines.length} unique machines for mould ${selectedMould}`);
      return uniqueMachines;
    } catch (error) {
      console.error('Error fetching machine data:', error);
      throw new Error('Failed to fetch machine data from MongoDB');
    }
  }

  // Create planning rows using createRows3 API
  async createPlanningRow(data: {
    machineName: string;
    mouldName: string;
    targetQuantity: number;
    startTime: string; // ISO string
    useDummyDevice: boolean;
    planningDeviceId: string;
  }): Promise<any> {
    try {
      console.log('Creating planning row...', data);
      
      // Convert start time to IST
      const startTimeIST = new Date(data.startTime).toLocaleString('sv-SE', {
        timeZone: 'Asia/Kolkata',
        hour12: false
      }).replace('T', ' ');

      // Choose device ID based on toggle
      const deviceId = data.useDummyDevice ? 'Planwise_Production_test' : data.planningDeviceId;

      const requestBody = {
        data: {
          rows: [
            {
              devID: deviceId,
              rawData: true,
              data: {
                D0: startTimeIST, // IST time
                D1: startTimeIST, // IST time (same as D0)
                F1: data.machineName,
                F2: data.mouldName,
                F3: "Planned",
                D2: data.targetQuantity.toString()
              }
            }
          ],
          nonIndex: false
        }
      };

      // Print the complete payload before hitting the API
      console.log('API Payload for createRows3:', JSON.stringify(requestBody, null, 2));
      console.log('Device ID being used:', deviceId);
      console.log('Converted IST time:', startTimeIST);

      // Make direct API call to createRows3
      const url = `https://datads.iosense.io/api/table/createRows3`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Planning row created successfully');
      return result;
    } catch (error) {
      console.error('Error creating planning row:', error);
      throw new Error('Failed to create planning row');
    }
  }
}

// Create and export a singleton instance
export const iosenseService = new IoSenseService();
export default iosenseService; 