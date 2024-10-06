<?php
namespace model;

require '../vendor/autoload.php';
use League\Csv\Reader;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


class Excel{

    private function isCsv($file){
        return preg_match("/\.csv$/",$file);
    }

    private function isXlsx($file){
        return preg_match("/\.xlsx$/",$file);
    }

    public function uploadFile(string $fileName,string $path){

        if($this->isCsv($fileName)){
            $csv = Reader::createFromPath($path, 'r');
            $csv->setHeaderOffset(0);
            $records = iterator_to_array($csv->getRecords());
            return json_encode($records);    
        }
        if($this->isXlsx($fileName)){
            $spreadsheet = IOFactory::load($path);
            $sheetData = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);
            $dataArray = [];
            foreach ($sheetData as $row) {
                $dataArray[] = (object) $row; 
            }
            return json_encode($dataArray); 
        }
    }

    public function downloadSheet($data) {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'product_name');
        $sheet->setCellValue('B1', 'quantity');
        $sheet->setCellValue('C1', 'price_per_item');
        $sheet->setCellValue('D1', 'time_submited');
        $sheet->setCellValue('E1', 'total_value');

        $row = 2; 
        foreach ($data as $item) {
            $sheet->setCellValue('A' . $row, $item['product_name']);
            $sheet->setCellValue('B' . $row, $item['quantity']);
            $sheet->setCellValue('C' . $row, $item['price_per_item']);
            $sheet->setCellValue('D' . $row, $item['time_submited']);
            $sheet->setCellValue('E' . $row, $item['total_value']);
            $row++;
        }

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="products.xlsx"');
        header('Cache-Control: max-age=0');

        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
    }

}