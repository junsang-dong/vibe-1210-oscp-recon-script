import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function PDFExport({ report }) {
  const generatePDF = async () => {
    const element = document.getElementById('report-content')
    if (!element) return

    try {
      // 로딩 표시
      const button = document.getElementById('pdf-button')
      button.disabled = true
      button.textContent = 'PDF 생성 중...'

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const filename = `OSCP_Report_${report.testInfo.target}_${report.testInfo.testDate}.pdf`
      pdf.save(filename)

      // 버튼 복구
      button.disabled = false
      button.textContent = '📥 PDF 다운로드'
    } catch (error) {
      console.error('PDF 생성 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="card">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          보고서 내보내기
        </h3>
        <button
          id="pdf-button"
          onClick={generatePDF}
          className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg"
        >
          <Download size={24} />
          📥 PDF 다운로드
        </button>
        <p className="text-sm text-gray-600 mt-4">
          전문가급 OSCP 스타일 보고서를 PDF로 저장하세요
        </p>
      </div>
    </div>
  )
}

