import os
import sys
# pip install pywin32
from win32com.client import Dispatch

def doc_to_docx(file_path, word):
    """
    将指定的doc文件转化为docx格式
    file_path: 文件路径
    word: 代表word应用程序
    """
    # 打开原始文档
    doc = word.Documents.Open(file_path)
    # 将文档另存为docx格式
    new_file_path = os.path.splitext(file_path)[0] + ".docx"
    # 16 为 docx，其他格式参考：https://learn.microsoft.com/zh-cn/office/vba/api/word.wdsaveformat
    doc.SaveAs(new_file_path, 16)
    doc.Close()
    # 删除原始文件
    #os.remove(file_path)
    print(f"【{file_path}】 已经被成功转换为 【{new_file_path}】")

def main():
    if len(sys.argv) == 1:
      print('用法： python dc.py <doc文件所在路径>')
      sys.exit()

    # 定义文件夹路径和Word应用程序对象
    folder_path = sys.argv[1] # r"D:\1"

    if os.path.isdir(folder_path) is False:
        print("文件夹路径不正确，请重新输入！")
        sys.exit()

    word = Dispatch("Word.Application")

    # 遍历文件夹中所有的.doc文件，并将其转换为.docx格式
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".doc"):
                file_path = os.path.join(root, file)
                if os.path.exists(file_path):
                  print(f"【{file_path}】 文件已存在！")
                else:
                  doc_to_docx(file_path, word)

    # 关闭Word应用程序
    word.Quit()

    print("处理完成!")

if __name__ == "__main__":
    main()
