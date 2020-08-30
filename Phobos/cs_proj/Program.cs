using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;

namespace Phobos
{
    class Program
    {
        [DllImport("user32.dll")]

        static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        static void Main(string[] args)
        {
            string path = Directory.GetCurrentDirectory();
            string bat_cmd = "\\phobos.bat";
            // https://stackoverflow.com/questions/5377423/hide-console-window-from-process-start-c-sharp
            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.UseShellExecute = false;
            startInfo.CreateNoWindow = true;
            startInfo.FileName = path + bat_cmd;
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;

            startInfo.CreateNoWindow = true;

            Process p = new Process();
            p.StartInfo = startInfo;
            p.Start();
            Debug.WriteLine("PID :" + p.Id);
            IntPtr handle = p.MainWindowHandle;
            ShowWindow(handle, 0);
            //Process p = Process.Start(path + bat_cmd);

            //Console.ReadKey();
        }
    }
}
