interface RawDayOffItem {
  tanggal: string;
  keterangan: string;
  is_cuti: boolean;
}

interface CombinedDayOff {
  [date: string]: {
    amount: number;
    endDate: string;
    id: number;
    startDate: string;
    title: string;
    modifiedAt: string;
    note: string;
    paid: number;
    createdAt: string;
    status: boolean;
  }[];
}

export const fetchDayOff = async (): Promise<any | null> => {
  try {
    const response = await fetch(`https://dayoffapi.vercel.app/api/`);
    const data: RawDayOffItem[] = await response.json();

    return data;
  } catch (error) {
    console.log('Failed to fetch DayOff data:', error);
    return null;
  }
};
