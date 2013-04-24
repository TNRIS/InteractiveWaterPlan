﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using InteractiveWaterPlan.Core;
using System.IO;
using System.Reflection;
using System.Text;

namespace InteractiveWaterPlan.MVC4.Formatters
{
    /// <summary>
    /// This formatter allows WebApi methods to output csv when the 
    /// mediatype header value is 'text/csv'
    /// From: http://www.asp.net/web-api/overview/formats-and-model-binding/media-formatters
    /// </summary>
    public class StrategyCsvFormatter : BufferedMediaTypeFormatter
    {
        public StrategyCsvFormatter()
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/csv"));
        }

        public StrategyCsvFormatter(MediaTypeMapping mediaTypeMapping) : this ()
        {
            MediaTypeMappings.Add(mediaTypeMapping);
        }

        public StrategyCsvFormatter(IEnumerable<MediaTypeMapping> mediaTypeMappings)
            : this()
        {
            foreach (var mapping in mediaTypeMappings)
            {
                MediaTypeMappings.Add(mapping);
            };
        }

        public override void SetDefaultContentHeaders(Type type, 
            HttpContentHeaders headers, MediaTypeHeaderValue mediaType)
        {
            base.SetDefaultContentHeaders(type, headers, mediaType);
            headers.Add("Content-Disposition", "attachment; filename=strategies.csv");
        }


        public override bool CanWriteType(Type type)
        {
            if (type == typeof(BaseStrategy) || type == typeof(CountyNetSupply))
            {
                return true;
            }
            else
            {
                Type stratEnumerableType = typeof(IEnumerable<BaseStrategy>);
                Type countyNetEnumerableType = typeof(IEnumerable<CountyNetSupply>);
                return stratEnumerableType.IsAssignableFrom(type) || countyNetEnumerableType.IsAssignableFrom(type);
            }
        }

        public override bool CanReadType(Type type)
        {
            return false;
        }


        public override void WriteToStream(Type type, object value, Stream writeStream, 
            System.Net.Http.HttpContent content)
        {
            using (var writer = new StreamWriter(writeStream))
            {
                var objects = value as IEnumerable<object>;
                if (objects != null)
                {
                    var firstObj = objects.FirstOrDefault();
                    if (firstObj != null)
                    {
                        WriteHeaders(firstObj, writer);
                    }

                    foreach (var obj in objects)
                    {
                        WriteItem(obj, writer);
                    }
                }
                else
                {
                    var singleObj = value as object;
                    if (singleObj == null)
                    {
                        throw new InvalidOperationException("Cannot serialize type");
                    }
                    WriteItem(singleObj, writer);
                }
            }
            writeStream.Close();
        }

        private void WriteHeaders(object obj, StreamWriter writer)
        {
            //Get properties using reflection.
            IList<PropertyInfo> propertyInfos = obj.GetType().GetProperties();

            var names = propertyInfos.Select<PropertyInfo, string>(
                p => p.Name).ToArray<string>();

            writer.WriteLine(String.Join(",", names));
        }

        private void WriteItem(object obj, StreamWriter writer)
        {
            //Get properties using reflection.
            IList<PropertyInfo> propertyInfos = obj.GetType().GetProperties();

            //add value for each property.
            var values = propertyInfos.Select<PropertyInfo, string>(
                p => Escape(p.GetValue(obj, null))).ToArray<string>();

            writer.WriteLine(String.Join(",", values));
        }

        static char[] _specialChars = new char[] { ',', '\n', '\r', '"' };

        private string Escape(object o)
        {
            if (o == null)
            {
                return "";
            }
            string field = o.ToString();
            if (field.IndexOfAny(_specialChars) != -1)
            {
                return String.Format("\"{0}\"", field.Replace("\"", "\"\""));
            }
            else return field;
        }
    }
}